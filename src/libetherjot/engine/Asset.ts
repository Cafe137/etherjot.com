import { Asset, BlogState } from './BlogState'
import { SwarmState } from './SwarmState'

export async function addAsset(
    swarmState: SwarmState,
    blogState: BlogState,
    name: string,
    byteArray: Uint8Array,
    contentType: string
): Promise<Asset> {
    const hash = await (await swarmState.swarm.newResource('upload', byteArray, contentType)).save()
    const asset = {
        reference: hash.hash,
        contentType,
        name
    }
    blogState.assets.push(asset)
    return asset
}
