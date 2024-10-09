import { useEffect, useState } from 'react'
import { assetPickerChannel } from '../GlobalContext'
import { BlogState } from '../libetherjot/engine/BlogState'
import { Modal } from '../Modal'
import './AssetBrowser.css'
import { PickableAsset } from './PickableAsset'

interface Props {
    blogState: BlogState
}

export function AssetPicker({ blogState }: Props) {
    const [isOpen, setIsOpen] = useState(false)

    function onClose() {
        setIsOpen(false)
    }

    useEffect(() => {
        return assetPickerChannel.subscribe((isOpen: boolean) => {
            setIsOpen(isOpen)
        })
    }, [])

    if (!isOpen) {
        return null
    }

    return (
        <Modal title="Pick an asset" onClose={onClose}>
            {blogState.assets.length === 0 && <p>You haven't uploaded any assets yet.</p>}
            <div className="thumbnail-container">
                {blogState.assets.map(x => (
                    <PickableAsset key={x.reference} asset={x} />
                ))}
            </div>
        </Modal>
    )
}
