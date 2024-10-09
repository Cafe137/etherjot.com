import Swal from 'sweetalert2'
import {
    assetBrowserChannel,
    onArticleReset,
    onBlogReset,
    onSaveToDriveRequest,
    onSaveToLocalRequest,
    screenChannel
} from './GlobalContext'
import { Horizontal } from './Horizontal'
import { onDriveExport, onDriveImport, onExport, onImport } from './io/ImportExport'
import { loadFromDrive } from './io/LoadSave'
import { BlogState } from './libetherjot/engine/BlogState'
import { SwarmState } from './libetherjot/engine/SwarmState'
import { MenuItem } from './MenuItem'
import { Screens } from './Navigation'
import { SquareImage } from './SquareImage'
import { Typography } from './Typography'

interface Props {
    blogState: BlogState
    swarmState: SwarmState
}

export function MenuBar({ blogState, swarmState }: Props) {
    function onSettings() {
        screenChannel.publish(Screens.SETTINGS)
    }

    async function onNewArticle() {
        const confirmed = await Swal.fire({
            title: 'Are you sure?',
            text: 'You will lose unsaved changes',
            showCancelButton: true
        })
        if (!confirmed.isConfirmed) {
            return
        }
        screenChannel.publish(Screens.EDITOR)
        onArticleReset.publish()
    }

    function onGoToBlog() {
        const url = `http://localhost:1633/bzz/${blogState.feed}/`
        window.open(url, '_blank')
    }

    function onViewSwarmHash() {
        Swal.fire({
            title: 'Swarm Hash',
            text: blogState.feed,
            icon: 'info'
        })
    }

    function onShowAssetBrowser() {
        assetBrowserChannel.publish(true)
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
        onBlogReset.publish()
    }

    async function onSaveAsMarkdown() {
        onSaveToLocalRequest.publish()
    }

    async function onSaveToDrive() {
        onSaveToDriveRequest.publish()
    }

    async function onLoadFromDrive() {
        await loadFromDrive(swarmState, blogState)
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
                        { name: 'Save to FDP Storage', onClick: onSaveToDrive },
                        { name: 'Load from FDP Storage', onClick: onLoadFromDrive }
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
                        { name: 'Export as zip', onClick: () => onExport(swarmState, blogState) },
                        { name: 'Import from zip', onClick: () => onImport() },
                        { name: 'Export to FDP Storage', onClick: () => onDriveExport(swarmState, blogState) },
                        { name: 'Import from FDP Storage', onClick: () => onDriveImport() }
                    ]}
                />
            </Horizontal>
            <Horizontal gap={16} p="0px 4px">
                <Horizontal gap={2}>
                    <Typography size={14}>Bee</Typography>
                    <SquareImage size={14} src={true ? './assets/yes.png' : './assets/no.png'} />
                </Horizontal>
                <Horizontal gap={2}>
                    <Typography size={14}>Stamp</Typography>
                    <SquareImage size={14} src={true ? './assets/yes.png' : './assets/no.png'} />
                </Horizontal>
            </Horizontal>
        </Horizontal>
    )
}
