import { Bee } from '@ethersphere/bee-js'
import { Dates, Strings } from 'cafe-utility'
import JSZip from 'jszip'
import Swal from 'sweetalert2'
import { swalLogin } from '../account/SwalLogin'
import { Article, GlobalState, saveGlobalState } from '../libetherjot'
import { makeFdp } from './FdpMaker'

export async function articleToMarkdown(bee: Bee, article: Article): Promise<string> {
    let markdown = (await bee.downloadFile(article.markdown)).data.text()
    markdown = `---
title: ${article.title}
category: ${article.category}
tags: ${article.tags.join(',')}
date: ${article.createdAt}
banner: ${article.banner}
kind: ${article.kind}
commentsFeed: ${article.commentsFeed}
---

${markdown}`
    return markdown
}

export async function onDriveImport() {
    Swal.fire('Todo')
}

export async function onDriveExport(globalState: GlobalState) {
    const bee = new Bee(globalState.beeApi)
    ;(await swalLogin()).ifPresent(async credentials => {
        Swal.fire('Connecting...')
        Swal.showLoading()
        try {
            const fdp = await makeFdp(globalState)
            Swal.fire('Logging in...')
            Swal.showLoading()
            await fdp.account.login(credentials.username, credentials.password)
            Swal.fire('Getting pods...')
            Swal.showLoading()
            const pods = await fdp.personalStorage.list()
            if (!pods.pods.some(p => p.name === 'etherjot')) {
                Swal.fire('Creating etherjot pod...')
                Swal.showLoading()
                await fdp.personalStorage.create('etherjot')
            }
            const directoryName = Dates.dateTimeSlug()
            Swal.fire('Creating main directory...')
            Swal.showLoading()
            await fdp.directory.create('etherjot', `/${directoryName}`)
            Swal.fire('Uploading blog json...')
            Swal.showLoading()
            await fdp.file.uploadData(
                'etherjot',
                `/${directoryName}/blog.json`,
                JSON.stringify(await saveGlobalState(globalState))
            )
            Swal.fire('Creating assets directory...')
            Swal.showLoading()
            await fdp.directory.create('etherjot', `/${directoryName}/assets`)
            for (const asset of globalState.assets) {
                Swal.fire(`Saving asset ${asset.name}...`)
                Swal.showLoading()
                await fdp.file.uploadData(
                    'etherjot',
                    `/${directoryName}/assets/${asset.name}`,
                    await bee.downloadData(asset.reference)
                )
            }
            Swal.fire('Creating articles directory...')
            Swal.showLoading()
            await fdp.directory.create('etherjot', `/${directoryName}/articles`)
            for (const article of globalState.articles) {
                Swal.fire(`Saving article ${article.title}...`)
                Swal.showLoading()
                const markdown = await articleToMarkdown(bee, article)
                await fdp.file.uploadData(
                    'etherjot',
                    `/${directoryName}/articles/${Strings.slugify(article.title)}.md`,
                    markdown
                )
            }
            Swal.hideLoading()
            Swal.fire('Exported to Fairdrive')
        } catch (error) {
            console.error(error)
            Swal.fire('Error', 'Failed to export to Fairdrive', 'error')
        }
    })
}

export async function onExport(globalState: GlobalState) {
    const bee = new Bee(globalState.beeApi)
    const blogJson = JSON.stringify(await saveGlobalState(globalState))
    const zip = new JSZip()
    zip.file('blog.json', blogJson)
    for (const asset of globalState.assets) {
        zip.file(`assets/${asset.name}`, await bee.downloadData(asset.reference))
    }
    for (const article of globalState.articles) {
        const markdown = await articleToMarkdown(bee, article)
        zip.file(`articles/${Strings.slugify(article.title)}.md`, markdown)
    }
    zip.generateAsync({ type: 'blob' }).then(content => {
        const url = URL.createObjectURL(content)
        const a = document.createElement('a')
        a.href = url
        a.download = 'etherjot.zip'
        a.click()
    })
}

export async function onImport() {
    Swal.fire('Todo')
}
