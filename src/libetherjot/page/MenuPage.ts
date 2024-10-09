import { BlogState } from '../engine/BlogState'
import { preprocess } from '../engine/Preprocessor'
import { SwarmState } from '../engine/SwarmState'
import { createFooter } from '../html/Footer'
import { createHeader } from '../html/Header'
import { createHtml5 } from '../html/Html5'
import { createStyleSheet } from '../html/StyleSheet'

export async function createMenuPage(
    swarmState: SwarmState,
    blogState: BlogState,
    title: string,
    markdown: string,
    parseFn: (markdown: string) => string
): Promise<{
    markdownReference: string
    swarmReference: string
}> {
    const head = `<title>${title} | ${blogState.configuration.title}</title>${createStyleSheet(0)}`
    const body = `${await createHeader(blogState, 0, 'Latest')}<main>${await preprocess(
        parseFn(markdown)
    )}</main>${await createFooter(blogState)}`
    const html = await createHtml5(head, body, 0)
    const markdownHandle = await (await swarmState.swarm.newResource('index.md', markdown, 'text/markdown')).save()
    const htmlHash = await (await swarmState.swarm.newRawData(html, 'text/html')).save()
    return {
        markdownReference: markdownHandle.hash,
        swarmReference: htmlHash
    }
}
