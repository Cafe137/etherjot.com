import { Dates } from 'cafe-utility'
import Swal from 'sweetalert2'
import { DeleteIcon } from './DeleteIcon'
import { EditIcon } from './EditIcon'
import { onArticleBeginEdit, onArticleDelete, screenChannel } from './GlobalContext'
import { Horizontal } from './Horizontal'
import { Article, BlogState } from './libetherjot/engine/BlogState'
import { parseMarkdown } from './libetherjot/engine/FrontMatter'
import { Screens } from './Navigation'
import { Typography } from './Typography'

interface Props {
    blogState: BlogState
    article: Article
}

export function ExistingArticle({ blogState, article }: Props) {
    async function onDelete() {
        const confirmed = await Swal.fire({
            title: 'Are you sure?',
            text: 'This action cannot be undone',
            showCancelButton: true
        })
        if (!confirmed.isConfirmed) {
            return
        }
        onArticleDelete.publish(article.title)
    }

    async function onEdit() {
        const confirmed = await Swal.fire({
            title: 'Are you sure?',
            text: 'You will lose unsaved changes',
            showCancelButton: true
        })
        if (!confirmed.isConfirmed) {
            return
        }
        onArticleBeginEdit.publish({
            title: article.title,
            markdown: parseMarkdown(article.markdown),
            category: article.category,
            tags: article.tags,
            banner: article.banner,
            date: Dates.isoDate(new Date(article.createdAt)),
            commentsFeed: article.commentsFeed,
            type: article.kind,
            oldTitle: article.title
        })
        screenChannel.publish(Screens.EDITOR)
    }

    return (
        <Horizontal gap={4}>
            <Typography size={14}>
                <a href={`http://localhost:1633/bzz/${blogState.feed}/${article.path}`} target="_blank">
                    {article.title}
                </a>
            </Typography>
            <EditIcon onEdit={onEdit} />
            <DeleteIcon onDelete={onDelete} />
        </Horizontal>
    )
}
