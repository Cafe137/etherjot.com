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
import { parseMarkdown } from './libetherjot/engine/FrontMatter'
import { Setting } from './Setting'
import './Sidebar.css'
import { TextInput } from './TextInput'
import { Typography } from './Typography'
import { Vertical } from './Vertical'

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
                    .map(Strings.shrinkTrim)
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
                    .map(Strings.shrinkTrim)
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
            <TextInput value={articleDate} setter={setArticleDate} label="Date" required hint="yyyy-mm-dd format" />
            <Vertical left gap={4} full>
                <Typography size={15}>Banner image</Typography>
                {articleBanner && <img src={`http://localhost:1633/bytes/${articleBanner}`} />}
                <Button secondary small onClick={() => assetPickerChannel.publish(true)}>
                    Select
                </Button>
            </Vertical>
            <Setting
                title="Type"
                type="select"
                value={articleType}
                onChange={value => {
                    setArticleType(value as 'regular' | 'h1' | 'h2')
                }}
                values={[
                    { name: 'Regular', value: 'regular' },
                    { name: 'Primary', value: 'h1' },
                    { name: 'Secondary', value: 'h2' }
                ]}
            />
            <TextInput value={articleTags} setter={setArticleTags} label="Tags" hint="Comma-separated" />
            <Button onClick={onPublish} disabled={!articleTitle || !articleCategory || loading}>
                {loading ? 'Saving...' : editing ? 'Update' : 'Publish'}
            </Button>
        </aside>
    )
}
