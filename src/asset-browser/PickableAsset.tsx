import { Optional, Strings } from 'cafe-utility'
import { assetPickChannel, assetPickerChannel } from '../GlobalContext'
import { Asset } from '../libetherjot/engine/BlogState'

interface Props {
    asset: Asset
}

export function PickableAsset({ asset }: Props) {
    function onClick() {
        assetPickChannel.publish(Optional.of(asset))
        assetPickerChannel.publish(false)
    }

    return (
        <div className="thumbnail" onClick={onClick}>
            <img className="thumbnail-image" src={Strings.joinUrl('http://localhost:1633/bytes', asset.reference)} />
            <p className="thumbnail-name">{asset.name}</p>
        </div>
    )
}
