import { Bee } from '@ethersphere/bee-js'
import { Strings } from 'cafe-utility'
import Swal from 'sweetalert2'
import { DEFAULT_CONTENT } from './Constants'
import { Horizontal } from './Horizontal'
import { onDriveExport, onDriveImport, onExport, onImport } from './io/ImportExport'
import { loadFromDrive, saveAsMarkdown, saveToDrive } from './io/LoadSave'
import { Article, GlobalState } from './libetherjot'
import { MenuItem } from './MenuItem'
import { SquareImage } from './SquareImage'
import { Typography } from './Typography'

interface Props {
    globalState: GlobalState
    setTab: (tab: string) => void
    articleContent: string
    isBeeRunning: boolean
    hasPostageStamp: boolean
    setArticleContent: (content: string) => void
    setArticleTitle: (title: string) => void
    setArticleBanner: (banner: string | null) => void
    setArticleCategory: (category: string) => void
    setArticleTags: (tags: string) => void
    setArticleCommentsFeed: (commentsFeed: string) => void
    setArticleType: (type: 'regular' | 'h1' | 'h2') => void
    editing: Article | false
    setEditing: (editing: Article | false) => void
    setShowAssetBrowser: (show: boolean) => void
}

export function MenuBar({
    globalState,
    setTab,
    articleContent,
    isBeeRunning,
    hasPostageStamp,
    setArticleContent,
    setArticleTitle,
    setArticleBanner,
    setArticleCategory,
    setArticleCommentsFeed,
    setArticleType,
    editing,
    setEditing,
    setShowAssetBrowser
}: Props) {
    async function onSettings() {
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
        setTab('global-settings')
    }

    async function onNewArticle() {
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
        setEditing(false)
        setArticleContent(DEFAULT_CONTENT)
        setArticleTitle('')
        setArticleBanner(null)
        setArticleCategory('')
        setArticleCommentsFeed(Strings.randomHex(40))
        setTab('new-post')
        setArticleType('regular')
    }

    function onGoToBlog() {
        const url = `http://localhost:1633/bzz/${globalState.feed}/`
        window.open(url, '_blank')
    }

    function onViewSwarmHash() {
        Swal.fire({
            title: 'Swarm Hash',
            text: globalState.feed,
            icon: 'info'
        })
    }

    function onShowAssetBrowser() {
        setShowAssetBrowser(true)
    }

    async function onReset() {
        const confirmed = await Swal.fire({
            title: 'Are you sure?',
            text: 'You will lose all your posts. You can export your blog from the settings page.',
            showCancelButton: true
        })
        if (!confirmed.isConfirmed) {
            return
        }
        const confirmedAgain = await Swal.fire({
            title: 'Are you really sure?',
            text: 'Your blog will be reset. This cannot be undone.',
            showCancelButton: true
        })
        if (!confirmedAgain.isConfirmed) {
            return
        }
        localStorage.clear()
        window.location.reload()
    }

    async function onSaveAsMarkdown() {
        await saveAsMarkdown(new Bee(globalState.beeApi), articleContent, editing || undefined)
    }

    async function onSaveToDrive() {
        await saveToDrive(globalState, articleContent, editing || undefined)
    }

    async function onLoadFromDrive() {
        await loadFromDrive(globalState, setArticleContent)
    }

    return (
        <Horizontal between background="#ffffff">
            <Horizontal gap={0}>
                <MenuItem
                    name="File"
                    actions={[
                        { name: 'New Article', onClick: onNewArticle },
                        { name: 'Assets...', onClick: onShowAssetBrowser },
                        { name: 'Save as markdown', onClick: onSaveAsMarkdown },
                        { name: 'Save to Drive', onClick: onSaveToDrive },
                        { name: 'Load from Drive', onClick: onLoadFromDrive }
                    ]}
                />
                <MenuItem name="View" actions={[{ name: 'Swarm Hash', onClick: onViewSwarmHash }]} />
                <MenuItem name="Go" actions={[{ name: 'Blog...', onClick: onGoToBlog }]} />
                <MenuItem
                    name="Settings"
                    actions={[
                        { name: 'Settings...', onClick: onSettings },
                        { name: 'Reset', onClick: onReset }
                    ]}
                />
                <MenuItem
                    name="Data"
                    actions={[
                        { name: 'Export as zip', onClick: () => onExport(globalState) },
                        { name: 'Import from zip', onClick: () => onImport() },
                        { name: 'Export to Drive', onClick: () => onDriveExport(globalState) },
                        { name: 'Import from Drive', onClick: () => onDriveImport() }
                    ]}
                />
            </Horizontal>
            <Horizontal gap={16} p="0px 4px">
                <Horizontal gap={2}>
                    <Typography size={14}>Bee</Typography>
                    <SquareImage size={14} src={isBeeRunning ? '/assets/yes.png' : '/assets/no.png'} />
                </Horizontal>
                <Horizontal gap={2}>
                    <Typography size={14}>Stamp</Typography>
                    <SquareImage size={14} src={hasPostageStamp ? '/assets/yes.png' : '/assets/no.png'} />
                </Horizontal>
            </Horizontal>
        </Horizontal>
    )
}
