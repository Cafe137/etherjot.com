import { BlogState } from '../engine/BlogState'
import { SwarmState } from '../engine/SwarmState'
import { createFooter } from '../html/Footer'
import { createHeader } from '../html/Header'
import { createHtml5 } from '../html/Html5'
import { createPostContainer } from '../html/PostContainer'
import { createStyleSheet } from '../html/StyleSheet'
import { createCollectionPage } from './CollectionPage'

export async function createFrontPage(swarmState: SwarmState, blogState: BlogState) {
    await buildCollectionPages(swarmState, blogState)
    const head = `<title>${blogState.configuration.title}</title>${createStyleSheet(0)}`
    const body = `
    ${await createHeader(blogState, 0, 'Latest')}
    <main>
        <div class="content-area">
            ${blogState.articles.length === 0 ? '<p class="no-content">This blog has no content yet.</p>' : ''}
            ${createPostContainer(blogState, 0)}
        </div>
    </main>
    ${await createFooter(blogState)}`
    const html = await createHtml5(head, body, 0)
    return swarmState.swarm.newRawData(html, 'text/html')
}

async function buildCollectionPages(swarmState: SwarmState, blogState: BlogState) {
    const uniqueCategories = new Set<string>()
    const uniqueTags = new Set<string>()
    for (const article of blogState.articles) {
        uniqueCategories.add(article.category)
        for (const tag of article.tags) {
            uniqueTags.add(tag)
        }
    }
    for (const category of uniqueCategories) {
        blogState.collections[category] = await createCollectionPage(swarmState, blogState, category)
    }
    for (const tag of uniqueTags) {
        blogState.collections[tag] = await createCollectionPage(swarmState, blogState, tag)
    }
}
