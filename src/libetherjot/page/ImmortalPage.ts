import { Bee } from '@ethersphere/bee-js'
import { Binary, Strings, Types } from 'cafe-utility'
import { parse } from 'marked'
import { BlogState } from '../engine/BlogState'
import { ParsedMarkdown } from '../engine/FrontMatter'
import { preprocess } from '../engine/Preprocessor'
import { SwarmState } from '../engine/SwarmState'
import { DEFAULT_IMAGE } from '../html/DefaultImage'
import { createStyle } from '../html/Style'

export async function createImmortalPage(
    swarmState: SwarmState,
    blogState: BlogState,
    title: string,
    markdown: ParsedMarkdown,
    banner: string,
    date: string
): Promise<string> {
    const bee = new Bee(swarmState.beeApi)
    let bannerDataUri: string
    const bannerAsset = banner ? blogState.assets.find(x => x.reference === banner) : null
    if (bannerAsset) {
        const data = await bee.downloadData(bannerAsset.reference)
        bannerDataUri = `data:${bannerAsset.contentType};base64,${Binary.uint8ArrayToBase64(data)}`
    } else {
        bannerDataUri = `data:image/png;base64,${DEFAULT_IMAGE}`
    }
    const processedArticle = await preprocess(parse(markdown.body))
    const imageSources = Strings.extractAllBlocks(processedArticle.html, {
        opening: '<img src="',
        closing: '"',
        exclusive: true
    })
    for (const imageSource of imageSources) {
        const swarmHash = Strings.searchHex(imageSource, 64)
        if (!swarmHash) {
            continue
        }
        const data = await bee.downloadData(swarmHash)
        let contentType = 'image/png'
        if (Types.isJpg(data)) {
            contentType = 'image/jpeg'
        }
        if (Types.isWebp(data)) {
            contentType = 'image/webp'
        }
        const dataUri = `data:${contentType};base64,${Binary.uint8ArrayToBase64(data)}`
        processedArticle.html = processedArticle.html.replace(`<img src="${imageSource}"`, `<img src="${dataUri}"`)
    }
    const bannerHtml = `<div class="content-area onpage-banner">
                <img src="${bannerDataUri}" class="banner" />
            </div>`
    const html = `
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <style>
            ${createStyle()}
        </style>
        <title>${title}</title>
    </head>
    <body>
    <main>
        <article>
            <div class="content-area grid-container">
                <div class="grid-6">
                    <h1>${title}</h1>
                </div>
            </div>
            ${bannerHtml}
            <div class="content-area grid-container">
                <aside class="grid-3">
                    <div class="article-sidebar">
                        <div class="article-sidebar-block">
                        ${
                            processedArticle.tableOfContents.length
                                ? `<h3>Jump to:</h3>
                            <div class="table-of-contents">
                                ${processedArticle.tableOfContents
                                    .map(x => `<a href="#${x}">${Strings.camelToTitle(Strings.slugToCamel(x))}</a>`)
                                    .join('')}
                            </div>`
                                : ''
                        }
                        </div>
                    </div>
                </aside>
                <div class="grid-6">
                    ${processedArticle.html}
                </div>
            </div>
        </article>
    </main>
    <footer>
        <table>
            <tr>
                <td>Publish date</td>
                <td>${new Date(date).toDateString()}</td>
            </tr>
            <tr>
                <td>Swarm feed</td>
                <td>${blogState.feed}</td>
            </tr>
            <tr>
                <td>Postage batch</td>
                <td>${swarmState.postageBatchId}</td>
            </tr>
            <tr>
                <td>Valid until</td>
                <td id="ttl">Loading...</td>
            </tr>
            <tr>
                <td>Actions</td>
                <td>
                    <button id="pin">Pin</button>
                    <button id="download">Download</button>
                    <button id="topup">Top up</button>
                </td>
        </table>
    </footer>
    <script>
        fetch('http://localhost:1633/stamps')
            .then(response => response.json())
            .then(data => {
                const stamp = data.stamps.find(x => x.batchID === '${swarmState.postageBatchId}')
                if (stamp) {
                    document.getElementById('ttl').innerText = new Date(Date.now() + stamp.batchTTL * 1000).toDateString()
                }
            })
        document.getElementById('pin').addEventListener('click', async () => {
            fetch('http://localhost:1633/pins/' + location.href.split('/bzz/')[1].slice(0, 64), { method: 'POST' })
                .then(response => {
                    if (response.ok) {
                        alert('Pinned')
                    } else {
                        alert('Failed to pin')
                    }
                })
                .catch(() => {
                    alert('Failed to pin')
                })
        })
        document.getElementById('download').addEventListener('click', async () => {
            const response = await fetch(location.href)
            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = '${Strings.slugify(title)}.html'
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
        })
        document.getElementById('topup').addEventListener('click', async () => {
        const amount = prompt('Enter amount')
        if (!amount) {
            return
        }
        fetch('http://localhost:1633/stamps/topup/${swarmState.postageBatchId}/' + amount, { method: 'PATCH' })
            .then(response => {
                if (response.ok) {
                    alert('Topped up')
                } else {
                    alert('Failed to top up')
                }
            })
            .catch(() => {
                alert('Failed to top up')
            })
        })
    </script>
    </body>
</html>`
    const uploadResult = await bee.uploadFile(swarmState.postageBatchId, html, 'index.html', {
        contentType: 'text/html'
    })
    return uploadResult.reference
}
