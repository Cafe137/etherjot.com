import { ExistingArticle } from './ExistingArticle'
import './Sidebar.css'
import { Typography } from './Typography'
import { Vertical } from './Vertical'
import { BlogState } from './libetherjot/engine/BlogState'
import { SwarmState } from './libetherjot/engine/SwarmState'

interface Props {
    swarmState: SwarmState
    blogState: BlogState
}

export function Sidebar({ swarmState, blogState }: Props) {
    return (
        <aside className="sidebar">
            <Vertical gap={16} left>
                <Typography size={18} bold>
                    Your Articles
                </Typography>
                {!blogState.articles.length && <Typography>No articles yet</Typography>}
                <Vertical gap={8} left>
                    {blogState.articles.map(x => (
                        <ExistingArticle key={x.title} article={x} swarmState={swarmState} blogState={blogState} />
                    ))}
                </Vertical>
            </Vertical>
        </aside>
    )
}
