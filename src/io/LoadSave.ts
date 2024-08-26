import { Bee } from '@ethersphere/bee-js'
import Swal from 'sweetalert2'
import { swalFiles } from '../account/SwalFiles'
import { swalLogin } from '../account/SwalLogin'
import { swalPods } from '../account/SwalPods'
import { Article, GlobalState } from '../libetherjot'
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

export async function saveToDrive(globalState: GlobalState, content: string, article?: Article): Promise<void> {
    const bee = new Bee(globalState.beeApi)
    const fileContent = article ? await articleToMarkdown(bee, article) : content
    const title = article ? article.title : 'Untitled.md'
    ;(await swalLogin()).ifPresent(async credentials => {
        ;(await swalPods(globalState, credentials)).ifPresent(async pod => {
            Swal.fire('Saving to FDP Storage...')
            Swal.showLoading()
            const fdp = await makeFdp(globalState)
            await fdp.account.login(credentials.username, credentials.password)
            await fdp.file.uploadData(pod, `/${title}`, fileContent)
            await Swal.fire('Saved to FDP Storage')
        })
    })
}

export async function loadFromDrive(globalState: GlobalState, setContent: (content: string) => void): Promise<void> {
    ;(await swalLogin()).ifPresent(async credentials => {
        ;(await swalPods(globalState, credentials)).ifPresent(async pod => {
            ;(await swalFiles(globalState, credentials, pod)).ifPresent(async fullPath => {
                const fdp = await makeFdp(globalState)
                await fdp.account.login(credentials.username, credentials.password)
                const content = new TextDecoder().decode(await fdp.file.downloadData(pod, fullPath))
                setContent(content)
            })
        })
    })
}

export async function getPods(globalState: GlobalState, credentials: Credentials) {
    const fdp = await makeFdp(globalState)
    await fdp.account.login(credentials.username, credentials.password)
    return (await fdp.personalStorage.list()).pods
}

export async function getFiles(globalState: GlobalState, credentials: Credentials, pod: string, prefix: string) {
    if (!prefix.startsWith('/')) {
        prefix = `/${prefix}`
    }
    const fdp = await makeFdp(globalState)
    await fdp.account.login(credentials.username, credentials.password)
    const files = await fdp.directory.read(pod, prefix)
    return files
}
