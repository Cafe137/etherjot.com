import { Optional, Strings } from 'cafe-utility'
import { Asset } from '../libetherjot'

interface Props {
    asset: Asset
    callback: (asset: Optional<Asset>) => void
}

export function PickableAsset({ asset, callback }: Props) {
    return (
        <div className="thumbnail" onClick={() => callback(Optional.of(asset))}>
            <img className="thumbnail-image" src={Strings.joinUrl('http://localhost:1633/bytes', asset.reference)} />
            <p className="thumbnail-name">{asset.name}</p>
        </div>
    )
}
