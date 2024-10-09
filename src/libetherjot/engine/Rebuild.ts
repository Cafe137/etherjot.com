import { createArticlePage } from '../page/ArticlePage'
import { createMenuPage } from '../page/MenuPage'
import { BlogState } from './BlogState'
import { parseMarkdown } from './FrontMatter'
import { SwarmState } from './SwarmState'

export async function rebuildMenuPages(
    swarmState: SwarmState,
    blogState: BlogState,
    parseFn: (markdown: string) => string
): Promise<void> {
    for (const page of blogState.pages) {
        const rawData = await swarmState.swarm.downloadRawData(page.markdown, 'text/markdown')
        const results = await createMenuPage(swarmState, blogState, page.title, rawData.utf8, parseFn)
        page.html = results.swarmReference
    }
}

export async function rebuildArticlePages(
    swarmState: SwarmState,
    blogState: BlogState,
    parseFn: (markdown: string) => string
): Promise<void> {
    for (const article of blogState.articles) {
        const rawData = await swarmState.swarm.downloadRawData(article.markdown, 'text/markdown')
        const results = await createArticlePage(
            swarmState,
            blogState,
            article.title,
            parseMarkdown(rawData.utf8),
            article.category,
            article.tags,
            article.banner,
            new Date(article.createdAt).toDateString(),
            article.commentsFeed,
            article.kind
        )
        article.html = results.html
    }
}
