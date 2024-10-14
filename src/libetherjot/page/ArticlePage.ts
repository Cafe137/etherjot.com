import { Strings } from 'cafe-utility'
import { parse } from 'marked'
import { Article, BlogState } from '../engine/BlogState'
import { ParsedMarkdown } from '../engine/FrontMatter'
import { preprocess } from '../engine/Preprocessor'
import { SwarmState } from '../engine/SwarmState'
import { createArticleSlug } from '../engine/Utility'
import { createCommentSystem } from '../html/Comment'
import { createDonationButton } from '../html/Donation'
import { createFooter } from '../html/Footer'
import { createHeader } from '../html/Header'
import { createHtml5 } from '../html/Html5'
import { createImmortalSvg } from '../html/ImmortalSvg'
import { createLinkSvg } from '../html/LinkSvg'
import { createRelatedArticles } from '../html/RelatedArticles'
import { createStyleSheet } from '../html/StyleSheet'
import { createTagCloud } from '../html/TagCloud'
import { createImmortalPage } from './ImmortalPage'

export async function createArticlePage(
    swarmState: SwarmState,
    blogState: BlogState,
    title: string,
    markdown: ParsedMarkdown,
    category: string,
    tags: string[],
    banner: string,
    date: string,
    commentsFeed: string,
    kind: 'regular' | 'h1' | 'h2' | 'highlight'
): Promise<Article> {
    const immortalHash = await createImmortalPage(swarmState, blogState, title, markdown, banner, date)
    const processedArticle = await preprocess(parse(markdown.body))
    const sidebarPublishedHtml = tags.length
        ? `<div class="article-sidebar-block"><h3>Published in:</h3><div class="tag-cloud">${createTagCloud(
              tags,
              2
          )}</div></div>`
        : ``
    const relatedArticlesHtml = createRelatedArticles(blogState, title, tags, 2)
    const readMoreHtml = relatedArticlesHtml
        ? `<div class="content-area"><h2 class="read-more">Read more...</h2>${relatedArticlesHtml}</div>`
        : ``
    const head = `<title>${title} | ${blogState.configuration.title}</title>${createStyleSheet(2)}`
    const bannerAsset = banner ? blogState.assets.find(x => x.reference === banner) : null
    const bannerSrc = bannerAsset ? '../'.repeat(2) + bannerAsset.name : '../'.repeat(2) + 'default.png'
    const bannerHtml = `<div class="content-area onpage-banner">
                <img src="${bannerSrc}" class="banner" />
            </div>`
    const imageBlocks = Strings.extractAllBlocks(processedArticle.html, {
        opening: '"http://localhost:1633/bytes/',
        closing: '"',
        exclusive: true
    })
    for (const block of imageBlocks) {
        const asset = blogState.assets.find(x => x.reference === block)
        if (asset) {
            processedArticle.html = processedArticle.html.replaceAll(
                `"http://localhost:1633/bytes/${block}"`,
                '../'.repeat(2) + asset.name
            )
        }
    }
    const body = `
    ${await createHeader(blogState, 2, 'Latest', 'p')}
    <main>
        <article>
            <div class="content-area grid-container">
                <div class="grid-3">
                    <p class="article-date">${date}</p>
                </div>
                <div class="grid-6">
                    ${createTagCloud([category], 2)}
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
                        ${sidebarPublishedHtml}
                        <div class="article-sidebar-block">
                            <h3>Actions:</h3>
                            <span id="share-link" class="pointer">${createLinkSvg()}</span>
                            <span id="share-immortal" class="pointer">${createImmortalSvg()}</span>
                        </div>
                    </div>
                </aside>
                <div class="grid-6">
                    ${processedArticle.html}
                    ${
                        blogState.configuration.extensions.donations &&
                        blogState.configuration.extensions.ethereumAddress
                            ? await createDonationButton(
                                  blogState.configuration.extensions.ethereumAddress,
                                  swarmState.postageBatchId
                              )
                            : ''
                    }
                    ${blogState.configuration.extensions.comments ? await createCommentSystem(commentsFeed) : ''}
                </div>
            </div>
        </article>
        ${readMoreHtml}
    </main>
    ${await createFooter(blogState)}
    <script>
        const shareLink = document.getElementById('share-link')
        const shareImmortal = document.getElementById('share-immortal')
        const url = window.location.href
        shareLink.addEventListener('click', () => {
            navigator.clipboard.writeText(url)
            alert('Link copied to clipboard!')
        })
        shareImmortal.addEventListener('click', () => {
            window.open('http://localhost:1633/bzz/${immortalHash}', '_blank')
        })
    </script>`
    const year = new Date(date).getFullYear()
    const html = await createHtml5(head, body, 2)
    const markdownHandle = await (await swarmState.swarm.newResource('index.md', markdown.body, 'text/markdown')).save()
    const htmlHash = await (await swarmState.swarm.newRawData(html, 'text/html')).save()
    const path = `${category}/${year}/${createArticleSlug(title)}`
    return {
        title,
        banner,
        preview: Strings.stripHtml(processedArticle.html).slice(0, 150) + '...',
        kind,
        category,
        tags,
        markdown: markdownHandle.hash,
        html: htmlHash,
        path,
        createdAt: new Date(date).getTime(),
        commentsFeed,
        stamp: await swarmState.swarm.mustGetUsableStamp()
    }
}
