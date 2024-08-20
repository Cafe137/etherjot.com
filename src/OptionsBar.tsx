import { Optional, Strings } from 'cafe-utility'
import { parse } from 'marked'
import { useState } from 'react'
import { Button } from './Button'
import { Article, Asset, GlobalState, createArticlePage, parseMarkdown } from './libetherjot'
import { save } from './Saver'
import './Sidebar.css'
import { TextInput } from './TextInput'
import { Typography } from './Typography'
import { Vertical } from './Vertical'

interface Props {
    globalState: GlobalState
    articleContent: string
    articleTitle: string
    setArticleTitle: (title: string) => void
    articleBanner: string | null
    setArticleBanner: (banner: string | null) => void
    articleCategory: string
    setArticleCategory: (category: string) => void
    articleTags: string
    setArticleTags: (tags: string) => void
    editing: Article | false
    setEditing: (editing: Article | false) => void
    articleType: 'regular' | 'h1' | 'h2'
    setArticleType: (type: 'regular' | 'h1' | 'h2') => void
    commentsFeed: string
    articleDate: string
    setArticleDate: (date: string) => void
    setShowAssetPicker: (show: boolean) => void
    setAssetPickerCallback: (callback: (asset: Optional<Asset>) => void) => void
}

export function OptionsBar({
    globalState,
    articleContent,
    articleTitle,
    setArticleTitle,
    articleBanner,
    setArticleBanner,
    articleCategory,
    setArticleCategory,
    articleTags,
    setArticleTags,
    editing,
    setEditing,
    articleType,
    setArticleType,
    commentsFeed,
    articleDate,
    setArticleDate,
    setShowAssetPicker,
    setAssetPickerCallback
}: Props) {
    const [loading, setLoading] = useState(false)
    const markdown = parseMarkdown(articleContent)

    async function onPublish() {
        if (!articleTitle || !articleContent) {
            return
        }
        setLoading(true)
        if (editing) {
            globalState.articles = globalState.articles.filter(x => x.html !== editing.html)
        }
        const results = await createArticlePage(
            articleTitle,
            markdown,
            globalState,
            articleCategory,
            articleTags
                .split(',')
                .map(x => Strings.shrinkTrim(x))
                .filter(x => x),
            articleBanner || '',
            articleDate,
            commentsFeed,
            articleType,
            parse
        )
        globalState.articles.push(results)
        await save(globalState)
        setEditing(false)
        window.location.reload()
    }

    return (
        <aside className="sidebar">
            <TextInput value={articleTitle} setter={setArticleTitle} label="Title" required />
            <TextInput value={articleCategory} setter={setArticleCategory} label="Category" required />
            <TextInput value={articleDate} setter={setArticleDate} label="Date" required />
            <Vertical left gap={4} full>
                <Typography size={15}>Banner image</Typography>
                {articleBanner && <img src={`http://localhost:1633/bytes/${articleBanner}`} />}
                <Button
                    secondary
                    small
                    onClick={() => {
                        setShowAssetPicker(true)
                        const callbackFn = (asset: Optional<Asset>) => {
                            asset.ifPresent(a => {
                                setArticleBanner(a.reference)
                            })
                            setShowAssetPicker(false)
                        }
                        setAssetPickerCallback(() => callbackFn)
                    }}
                >
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
