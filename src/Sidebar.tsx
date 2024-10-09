import { ExistingArticle } from './ExistingArticle'
import './Sidebar.css'
import { Typography } from './Typography'
import { Vertical } from './Vertical'
import { BlogState } from './libetherjot/engine/BlogState'

interface Props {
    blogState: BlogState
}

export function Sidebar({ blogState }: Props) {
    return (
        <aside className="sidebar">
            <Vertical gap={16} left>
                <Typography size={18} bold>
                    Your Articles
                </Typography>
                {!blogState.articles.length && <Typography>No articles yet</Typography>}
                <Vertical gap={8} left>
                    {blogState.articles.map((x, i) => (
                        <ExistingArticle key={x.title} article={x} blogState={blogState} />
                    ))}
                </Vertical>
            </Vertical>
        </aside>
    )
}
