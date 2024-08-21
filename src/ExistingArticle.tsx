import { Bee } from '@ethersphere/bee-js'
import Swal from 'sweetalert2'
import { DEFAULT_CONTENT } from './Constants'
import { Horizontal } from './Horizontal'
import { Icon } from './Icon'
import { Article, GlobalState } from './libetherjot'
import { save } from './Saver'
import { Typography } from './Typography'

interface Props {
    article: Article
    globalState: GlobalState
    setTab: (tab: string) => void
    setEditing: (editing: Article | false) => void
    articleContent: string
    setArticleContent: (content: string) => void
    setArticleTitle: (title: string) => void
    setArticleBanner: (banner: string | null) => void
    setArticleCategory: (category: string) => void
    setArticleTags: (tags: string) => void
    setArticleCommentsFeed: (commentsFeed: string) => void
    setArticleType: (type: 'regular' | 'h1' | 'h2') => void
}

export function ExistingArticle({
    article,
    globalState,
    setTab,
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
    async function onDelete() {
        globalState.articles = globalState.articles.filter(x => x !== article)
        await save(globalState)
        window.location.reload()
    }

    async function onEdit() {
        if (articleContent !== DEFAULT_CONTENT) {
            const confirmed = await Swal.fire({
                title: 'Are you sure?',
                text: 'You will lose unsaved changes',
                showCancelButton: true
            })
            if (!confirmed.isConfirmed) {
                return
            }
        }
        const bee = new Bee('http://localhost:1633')
        const raw = await bee.downloadFile(article.markdown)
        setEditing(article)
        setArticleTitle(article.title)
        setArticleContent(raw.data.text())
        setArticleBanner(article.banner)
        setArticleCategory(article.category)
        setArticleTags(article.tags.join(', '))
        setArticleCommentsFeed(article.commentsFeed)
        let articleType: 'regular' | 'h1' | 'h2' = 'regular'
        if (article.kind === 'h1') {
            articleType = 'h1'
        }
        if (article.kind === 'h2') {
            articleType = 'h2'
        }
        setArticleType(articleType)
        setTab('new-post')
    }

    return (
        <Horizontal gap={4}>
            <Typography size={14}>
                <a href={`http://localhost:1633/bzz/${globalState.feed}/${article.path}`} target="_blank">
                    {article.title}
                </a>
            </Typography>
            <Icon src="./assets/edit.svg" onClick={onEdit} size={16} />
            <Icon src="./assets/minus.svg" onClick={onDelete} size={16} />
        </Horizontal>
    )
}
