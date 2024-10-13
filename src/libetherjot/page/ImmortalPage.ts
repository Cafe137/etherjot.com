import { Bee } from '@ethersphere/bee-js'
import { Binary, Strings } from 'cafe-utility'
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
        const data = await bee.downloadFile(bannerAsset.reference)
        bannerDataUri = `data:${bannerAsset.contentType};base64,${Binary.uint8ArrayToBase64(data.data)}`
    } else {
        bannerDataUri = `data:image/png;base64,${DEFAULT_IMAGE}`
    }
    const processedArticle = await preprocess(parse(markdown.body))
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
                <div class="grid-3">
                    <p class="article-date">${date}</p>
                </div>
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
    </body>
</html>`
    const uploadResult = await bee.uploadFile(swarmState.postageBatchId, html, 'index.html', {
        contentType: 'text/html'
    })
    return uploadResult.reference
}
