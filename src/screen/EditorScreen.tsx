import { Arrays } from 'cafe-utility'
import { useEffect, useState } from 'react'
import { DEFAULT_CONTENT } from '../Constants'
import { onArticleBeginEdit, onArticleReset, onContentInsert, onContentReplace } from '../GlobalContext'
import { BlogState } from '../libetherjot/engine/BlogState'
import { SwarmState } from '../libetherjot/engine/SwarmState'
import { MenuBar } from '../MenuBar'
import { NewPostPage } from '../NewPostPage'
import { OptionsBar } from '../OptionsBar'
import { Sidebar } from '../Sidebar'

interface Props {
    blogState: BlogState
    swarmState: SwarmState
}

export function EditorScreen({ blogState, swarmState }: Props) {
    const [articleContent, setArticleContent] = useState(DEFAULT_CONTENT)

    useEffect(() => {
        return Arrays.multicall([
            onContentInsert.subscribe(snippet => {
                setArticleContent(x => x + snippet)
            }),
            onContentReplace.subscribe(snippet => {
                setArticleContent(snippet)
            }),
            onArticleReset.subscribe(() => {
                setArticleContent(DEFAULT_CONTENT)
            }),
            onArticleBeginEdit.subscribe(article => {
                setArticleContent(article.markdown.body)
            })
        ])
    }, [])

    return (
        <>
            <MenuBar blogState={blogState} swarmState={swarmState} />
            <main>
                <Sidebar swarmState={swarmState} blogState={blogState} />
                <NewPostPage articleContent={articleContent} setArticleContent={setArticleContent} />
                <OptionsBar articleContent={articleContent} />
            </main>
        </>
    )
}
