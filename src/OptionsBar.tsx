import { Arrays, Dates, Strings } from 'cafe-utility'
import { useEffect, useState } from 'react'
import { Button } from './Button'
import {
    ArticleEdit,
    assetPickChannel,
    assetPickerChannel,
    onArticleBeginEdit,
    onArticleCreate,
    onArticleEdit,
    onArticleReset,
    onArticleSuccess,
    onSaveToDrive,
    onSaveToDriveRequest,
    onSaveToLocal,
    onSaveToLocalRequest
} from './GlobalContext'
import './Sidebar.css'
import { TextInput } from './TextInput'
import { Typography } from './Typography'
import { Vertical } from './Vertical'
import { parseMarkdown } from './libetherjot/engine/FrontMatter'

interface Props {
    articleContent: string
}

export function OptionsBar({ articleContent }: Props) {
    const [loading, setLoading] = useState(false)
    const [articleTitle, setArticleTitle] = useState('')
    const [articleBanner, setArticleBanner] = useState<string | null>(null)
    const [articleCategory, setArticleCategory] = useState<string>('')
    const [articleTags, setArticleTags] = useState<string>('')
    const [articleType, setArticleType] = useState<'regular' | 'h1' | 'h2' | 'highlight'>('regular')
    const [articleDate, setArticleDate] = useState(Dates.isoDate())
    const [editing, setEditing] = useState<ArticleEdit | false>(false)
    const [commentsFeed, setCommentsFeed] = useState<string>(Strings.randomHex(40))

    useEffect(() => {
        return Arrays.multicall([
            onArticleBeginEdit.subscribe(article => {
                setArticleTitle(article.title)
                setArticleCategory(article.category)
                setArticleTags(article.tags.join(', '))
                setArticleBanner(article.banner && article.banner !== 'default.png' ? article.banner : null)
                setArticleDate(article.date)
                setEditing(article)
                setCommentsFeed(article.commentsFeed)
                setArticleType(article.type)
            }),
            onSaveToDriveRequest.subscribe(() => {
                onSaveToDrive.publish({
                    content: articleContent,
                    article: editing || undefined
                })
            }),
            onSaveToLocalRequest.subscribe(() => {
                onSaveToLocal.publish({
                    content: articleContent,
                    article: editing || undefined
                })
            }),
            assetPickChannel.subscribe(asset => {
                asset.ifPresent(a => {
                    setArticleBanner(a.reference)
                })
            }),
            onArticleSuccess.subscribe(() => {
                setArticleTitle('')
                setArticleCategory('')
                setArticleTags('')
                setArticleBanner(null)
                setArticleDate(Dates.isoDate())
                setEditing(false)
                setCommentsFeed(Strings.randomHex(40))
                setArticleType('regular')
                setLoading(false)
            }),
            onArticleReset.subscribe(() => {
                setArticleTitle('')
                setArticleCategory('')
                setArticleTags('')
                setArticleBanner(null)
                setArticleDate(Dates.isoDate())
                setEditing(false)
                setCommentsFeed(Strings.randomHex(40))
                setArticleType('regular')
                setLoading(false)
            })
        ])
    }, [])

    async function onPublish() {
        if (!articleTitle || !articleContent) {
            return
        }
        setLoading(true)
        if (editing) {
            onArticleEdit.publish({
                oldTitle: editing.title,
                title: articleTitle,
                markdown: parseMarkdown(articleContent),
                category: articleCategory,
                tags: articleTags
                    .split(',')
                    .map(x => x.trim())
                    .filter(x => x),
                banner: articleBanner || '',
                date: articleDate,
                commentsFeed,
                type: articleType
            })
            setEditing(false)
        } else {
            onArticleCreate.publish({
                title: articleTitle,
                markdown: parseMarkdown(articleContent),
                category: articleCategory,
                tags: articleTags
                    .split(',')
                    .map(x => x.trim())
                    .filter(x => x),
                banner: articleBanner || '',
                date: articleDate,
                commentsFeed,
                type: articleType
            })
        }
    }

    return (
        <aside className="sidebar">
            {editing && (
                <Vertical left gap={4}>
                    <Typography bold>Editing:</Typography>
                    <Typography>{editing.title}</Typography>
                </Vertical>
            )}
            <TextInput value={articleTitle} setter={setArticleTitle} label="Title" required />
            <TextInput value={articleCategory} setter={setArticleCategory} label="Category" required />
            <TextInput value={articleDate} setter={setArticleDate} label="Date" required />
            <Vertical left gap={4} full>
                <Typography size={15}>Banner image</Typography>
                {articleBanner && <img src={`http://localhost:1633/bytes/${articleBanner}`} />}
                <Button secondary small onClick={() => assetPickerChannel.publish(true)}>
                    Select
                </Button>
            </Vertical>
            <Vertical left gap={4} full>
                <Typography size={15}>Type</Typography>
                <select
                    className="etherjot-input"
                    value={articleType}
                    onChange={event => {
                        if (event.target.value === 'regular') {
                            setArticleType('regular')
                        }
                        if (event.target.value === 'h1') {
                            setArticleType('h1')
                        }
                        if (event.target.value === 'h2') {
                            setArticleType('h2')
                        }
                    }}
                >
                    <option value="regular">Regular</option>
                    <option value="h1">Primary</option>
                    <option value="h2">Secondary</option>
                </select>
            </Vertical>
            <TextInput value={articleTags} setter={setArticleTags} label="Tags (comma)" />
            <Button onClick={onPublish} disabled={!articleTitle || !articleCategory || loading}>
                {loading ? 'Saving...' : editing ? 'Update' : 'Publish'}
            </Button>
        </aside>
    )
}
