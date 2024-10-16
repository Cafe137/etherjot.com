import { Optional, PubSubChannel } from 'cafe-utility'
import JSZip from 'jszip'
import { Asset, Configuration } from './libetherjot/engine/BlogState'
import { ParsedMarkdown } from './libetherjot/engine/FrontMatter'
import { Screens } from './Navigation'

export interface ArticleMetadata {
    title: string
    category: string
    tags: string[]
    banner: string
    date: string
    type: 'regular' | 'h1' | 'h2' | 'highlight'
}

export interface ArticleBase extends ArticleMetadata {
    markdown: ParsedMarkdown
}

export interface ArticleEdit extends ArticleBase {
    oldTitle: string
}

interface Saveable {
    content: string
    article?: ArticleEdit
}

export const screenChannel = new PubSubChannel<Screens>()
export const assetBrowserChannel = new PubSubChannel<boolean>()
export const assetPickerChannel = new PubSubChannel<boolean>()
export const assetPickChannel = new PubSubChannel<Optional<Asset>>()

export const onBlogCreate = new PubSubChannel<void>()
export const onBlogReset = new PubSubChannel<void>()

export const onAssetAdded = new PubSubChannel<Asset>()
export const onAssetRename = new PubSubChannel<{ reference: string; name: string }>()
export const onAssetDelete = new PubSubChannel<string>()

export const onArticleBeginEdit = new PubSubChannel<ArticleEdit>()
export const onArticleDelete = new PubSubChannel<string>()
export const onArticleEdit = new PubSubChannel<ArticleEdit>()
export const onArticleCreate = new PubSubChannel<ArticleBase>()
export const onArticleSuccess = new PubSubChannel<void>()
export const onArticleReset = new PubSubChannel<void>()

export const onContentInsert = new PubSubChannel<string>()
export const onContentReplace = new PubSubChannel<string>()

export const onConfigurationChange = new PubSubChannel<Configuration>()
export const onConfigurationSuccess = new PubSubChannel<void>()

export const onSaveToDriveRequest = new PubSubChannel<void>()
export const onSaveToDrive = new PubSubChannel<Saveable>()
export const onSaveToLocal = new PubSubChannel<void>()

export const onLoadState = new PubSubChannel<string>()
export const onLoadSuccess = new PubSubChannel<void>()

export const onZipImport = new PubSubChannel<JSZip>()
