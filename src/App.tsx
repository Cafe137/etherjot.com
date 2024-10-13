import { Arrays } from 'cafe-utility'
import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import './App.css'
import { AssetBrowser } from './asset-browser/AssetBrowser'
import { AssetPicker } from './asset-browser/AssetPicker'
import {
    onArticleCreate,
    onArticleDelete,
    onArticleEdit,
    onArticleSuccess,
    onAssetAdded,
    onAssetDelete,
    onAssetRename,
    onBlogCreate,
    onBlogReset,
    onConfigurationChange,
    onConfigurationSuccess,
    onLoadState,
    onLoadSuccess,
    screenChannel
} from './GlobalContext'
import { BlogState, getBlogState, saveBlogState } from './libetherjot/engine/BlogState'
import { recreateMantaray } from './libetherjot/engine/Mantaray'
import { getSwarmState, SwarmState } from './libetherjot/engine/SwarmState'
import { createArticlePage } from './libetherjot/page/ArticlePage'
import { Screens } from './Navigation'
import { LocalStorageKeys } from './Persistence'
import { EditorScreen } from './screen/EditorScreen'
import { SettingsScreen } from './screen/SettingsScreen'
import { WelcomeScreen } from './screen/WelcomeScreen'
import { Typography } from './Typography'

export function App() {
    const [swarmState, setSwarmState] = useState<SwarmState | null>(null)
    const [blogState, setBlogState] = useState<BlogState | null>(null)
    const [screen, setScreen] = useState<Screens>(Screens.WELCOME)

    function navigate(allowWelcome: boolean) {
        const hash = window.location.hash
        if (hash === '#/editor') {
            setScreen(Screens.EDITOR)
        } else if (hash === '#/settings') {
            setScreen(Screens.SETTINGS)
        } else if (allowWelcome) {
            setScreen(Screens.WELCOME)
            window.location.hash = ''
        } else {
            setScreen(Screens.EDITOR)
            window.location.hash = '#/editor'
        }
    }

    useEffect(() => {
        const storedSwarmState = localStorage.getItem(LocalStorageKeys.SWARM)
        const storedBlogState = localStorage.getItem(LocalStorageKeys.BLOG)
        let checks = 0
        if (storedSwarmState) {
            const parsedSwarmState = JSON.parse(storedSwarmState)
            setSwarmState(getSwarmState(parsedSwarmState))
            checks++
        }
        if (storedBlogState) {
            const parsedBlogState = JSON.parse(storedBlogState)
            setBlogState(getBlogState(parsedBlogState))
            checks++
        }
        navigate(checks !== 2)
        return Arrays.multicall([
            onLoadState.subscribe(async message => {
                Swal.fire({
                    allowEnterKey: false,
                    allowEscapeKey: false,
                    title: message,
                    showConfirmButton: false,
                    didOpen: () => Swal.showLoading()
                })
            }),
            onLoadSuccess.subscribe(async () => {
                Swal.close()
            }),
            screenChannel.subscribe(newScreen => {
                switch (newScreen) {
                    case Screens.EDITOR:
                        window.location.hash = '#/editor'
                        break
                    case Screens.SETTINGS:
                        window.location.hash = '#/settings'
                        break
                    default:
                        window.location.hash = ''
                        break
                }
                navigate(true)
            }),
            onBlogCreate.subscribe(() => {
                const storedSwarmState = localStorage.getItem(LocalStorageKeys.SWARM)
                const storedBlogState = localStorage.getItem(LocalStorageKeys.BLOG)
                if (!storedSwarmState || !storedBlogState) {
                    return
                }
                setBlogState(getBlogState(JSON.parse(storedBlogState)))
                setSwarmState(getSwarmState(JSON.parse(storedSwarmState)))
            })
        ])
    }, [])

    useEffect(() => {
        if (!blogState || !swarmState) {
            return
        }
        return Arrays.multicall([
            onBlogReset.subscribe(() => {
                localStorage.removeItem(LocalStorageKeys.BLOG)
                localStorage.removeItem(LocalStorageKeys.SWARM)
                setBlogState(null)
                setSwarmState(null)
                setScreen(Screens.WELCOME)
            }),
            onAssetAdded.subscribe(asset => {
                blogState.assets.push(asset)
                setBlogState({ ...blogState })
                saveBlogState(blogState)
            }),
            onAssetRename.subscribe(({ reference, name }) => {
                const asset = blogState.assets.find(x => x.reference === reference)
                if (!asset) {
                    return
                }
                asset.name = name
                setBlogState({ ...blogState })
                saveBlogState(blogState)
            }),
            onAssetDelete.subscribe(reference => {
                blogState.assets = blogState.assets.filter(x => x.reference !== reference)
                setBlogState({ ...blogState })
                saveBlogState(blogState)
            }),
            onArticleCreate.subscribe(async article => {
                onLoadState.publish('Creating article...')
                const articlePage = await createArticlePage(
                    swarmState,
                    blogState,
                    article.title,
                    article.markdown,
                    article.category,
                    article.tags,
                    article.banner || 'default.png',
                    article.date,
                    article.commentsFeed,
                    article.type
                )
                blogState.articles.push(articlePage)
                await recreateMantaray(swarmState, blogState)
                setBlogState({ ...blogState })
                saveBlogState(blogState)
                Swal.fire('Article Created', 'The article was created successfully.', 'success')
                onArticleSuccess.publish()
            }),
            onArticleEdit.subscribe(async article => {
                blogState.articles = blogState.articles.filter(x => x.title !== article.oldTitle)
                const articlePage = await createArticlePage(
                    swarmState,
                    blogState,
                    article.title,
                    article.markdown,
                    article.category,
                    article.tags,
                    article.banner || 'default.png',
                    article.date,
                    article.commentsFeed,
                    article.type
                )
                blogState.articles.push(articlePage)
                await recreateMantaray(swarmState, blogState)
                setBlogState({ ...blogState })
                saveBlogState(blogState)
                Swal.fire('Article Updated', 'The article was updated successfully.', 'success')
                onArticleSuccess.publish()
            }),
            onArticleDelete.subscribe(async title => {
                onLoadState.publish('Deleting article...')
                blogState.articles = blogState.articles.filter(article => article.title !== title)
                await recreateMantaray(swarmState, blogState)
                setBlogState({ ...blogState })
                saveBlogState(blogState)
                Swal.fire('Article Deleted', 'The article was deleted successfully.', 'success')
            }),
            onConfigurationChange.subscribe(async configuration => {
                blogState.configuration = configuration
                await recreateMantaray(swarmState, blogState)
                setBlogState({ ...blogState })
                saveBlogState(blogState)
                Swal.fire('Configuration Saved', 'The configuration was saved successfully.', 'success')
                onConfigurationSuccess.publish()
            })
        ])
    }, [blogState])

    if (screen === Screens.WELCOME || !blogState || !swarmState) {
        return <WelcomeScreen />
    }

    if (screen === Screens.EDITOR) {
        return (
            <>
                <AssetBrowser blogState={blogState} swarmState={swarmState} />
                <AssetPicker blogState={blogState} />
                <EditorScreen blogState={blogState} swarmState={swarmState} />
            </>
        )
    }

    if (screen === Screens.SETTINGS) {
        return (
            <>
                <AssetBrowser blogState={blogState} swarmState={swarmState} />
                <AssetPicker blogState={blogState} />
                <SettingsScreen blogState={blogState} swarmState={swarmState} />
            </>
        )
    }

    return <Typography>Something went wrong.</Typography>
}
