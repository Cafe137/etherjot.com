import { BlogState } from '../engine/BlogState'
import { SwarmState } from '../engine/SwarmState'
import { createFooter } from '../html/Footer'
import { createHeader } from '../html/Header'
import { createHtml5 } from '../html/Html5'
import { createPostContainer } from '../html/PostContainer'
import { createStyleSheet } from '../html/StyleSheet'

export async function createCollectionPage(
    swarmState: SwarmState,
    blogState: BlogState,
    collectionName: string
): Promise<string> {
    const head = `<title>${blogState.configuration.title} | ${collectionName} Posts</title>${createStyleSheet(0)}`
    const body = `
    ${await createHeader(blogState, 0, collectionName)}
    <main>
        <div class="content-area">
            ${createPostContainer(blogState, 0, collectionName)}
        </div>
    </main>
    ${await createFooter(blogState)}`
    const html = await createHtml5(head, body, 0)
    const htmlHash = await (await swarmState.swarm.newRawData(html, 'text/html')).save()
    return htmlHash
}
