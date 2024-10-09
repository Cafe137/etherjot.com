import { Bee } from '@ethersphere/bee-js'
import Swal from 'sweetalert2'
import { swalFiles } from '../account/SwalFiles'
import { swalLogin } from '../account/SwalLogin'
import { swalPods } from '../account/SwalPods'
import { onContentReplace } from '../GlobalContext'
import { Article, BlogState } from '../libetherjot/engine/BlogState'
import { SwarmState } from '../libetherjot/engine/SwarmState'
import { Credentials } from '../type/Credentials'
import { makeFdp } from './FdpMaker'
import { articleToMarkdown } from './ImportExport'

export async function saveAsMarkdown(bee: Bee, content: string, article?: Article): Promise<void> {
    const fileContent = article ? await articleToMarkdown(bee, article) : content
    const blob = new Blob([fileContent], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = article ? `${article.title}.md` : 'Untitled.md'
    a.click()
}

export async function saveToDrive(
    swarmState: SwarmState,
    blogState: BlogState,
    content: string,
    article?: Article
): Promise<void> {
    const bee = new Bee(swarmState.beeApi)
    const fileContent = article ? await articleToMarkdown(bee, article) : content
    const title = article ? article.title : 'Untitled.md'
    ;(await swalLogin()).ifPresent(async credentials => {
        ;(await swalPods(swarmState, blogState, credentials)).ifPresent(async pod => {
            Swal.fire('Saving to FDP Storage...')
            Swal.showLoading()
            const fdp = await makeFdp(swarmState, blogState)
            await fdp.account.login(credentials.username, credentials.password)
            await fdp.file.uploadData(pod, `/${title}`, fileContent)
            await Swal.fire('Saved to FDP Storage')
        })
    })
}

export async function loadFromDrive(swarmState: SwarmState, blogState: BlogState): Promise<void> {
    ;(await swalLogin()).ifPresent(async credentials => {
        ;(await swalPods(swarmState, blogState, credentials)).ifPresent(async pod => {
            ;(await swalFiles(swarmState, blogState, credentials, pod)).ifPresent(async fullPath => {
                const fdp = await makeFdp(swarmState, blogState)
                await fdp.account.login(credentials.username, credentials.password)
                const content = new TextDecoder().decode(await fdp.file.downloadData(pod, fullPath))
                onContentReplace.publish(content)
            })
        })
    })
}

export async function getPods(swarmState: SwarmState, blogState: BlogState, credentials: Credentials) {
    const fdp = await makeFdp(swarmState, blogState)
    await fdp.account.login(credentials.username, credentials.password)
    return (await fdp.personalStorage.list()).pods
}

export async function getFiles(
    swarmState: SwarmState,
    blogState: BlogState,
    credentials: Credentials,
    pod: string,
    prefix: string
) {
    if (!prefix.startsWith('/')) {
        prefix = `/${prefix}`
    }
    const fdp = await makeFdp(swarmState, blogState)
    await fdp.account.login(credentials.username, credentials.password)
    const files = await fdp.directory.read(pod, prefix)
    return files
}
