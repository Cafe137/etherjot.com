import { ExistingArticle } from './ExistingArticle'
import './Sidebar.css'
import { Typography } from './Typography'
import { Vertical } from './Vertical'
import { Article, GlobalState } from './libetherjot'

interface Props {
    globalState: GlobalState
    setTab: (tab: string) => void
    editing: Article | false
    setEditing: (editing: Article | false) => void
    articleContent: string
    setArticleContent: (content: string) => void
    setArticleTitle: (title: string) => void
    setArticleBanner: (banner: string | null) => void
    setArticleCategory: (category: string) => void
    setArticleTags: (tags: string) => void
    setArticleCommentsFeed: (commentsFeed: string) => void
    setShowAssetBrowser: (show: boolean) => void
    setArticleType: (type: 'regular' | 'h1' | 'h2') => void
}

export function Sidebar({
    globalState,
    setTab,
    editing,
    setEditing,
    articleContent,
    setArticleContent,
    setArticleTitle,
    setArticleBanner,
    setArticleCategory,
    setArticleTags,
    setArticleCommentsFeed,
    setArticleType
}: Props) {
    return (
        <aside className="sidebar">
            {editing && (
                <Vertical left gap={4}>
                    <Typography bold>Editing:</Typography>
                    <Typography>{editing.title}</Typography>
                </Vertical>
            )}
            <Vertical gap={16} left>
                <Typography size={18} bold>
                    Your Articles
                </Typography>
                {!globalState.articles.length && <Typography>No articles yet</Typography>}
                <Vertical gap={8} left>
                    {globalState.articles.map((x, i) => (
                        <ExistingArticle
                            key={x.title}
                            article={x}
                            globalState={globalState}
                            setTab={setTab}
                            setEditing={setEditing}
                            articleContent={articleContent}
                            setArticleContent={setArticleContent}
                            setArticleTitle={setArticleTitle}
                            setArticleBanner={setArticleBanner}
                            setArticleCategory={setArticleCategory}
                            setArticleTags={setArticleTags}
                            setArticleCommentsFeed={setArticleCommentsFeed}
                            setArticleType={setArticleType}
                        />
                    ))}
                </Vertical>
            </Vertical>
        </aside>
    )
}
