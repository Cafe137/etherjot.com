import { SwarmState } from './SwarmState'

interface UploadedFile {
    reference: string
    path: string
}

export async function uploadImage(swarmState: SwarmState, path: string, buffer: Buffer): Promise<UploadedFile> {
    const hash = await (await swarmState.swarm.newRawData(buffer, 'image/png')).save()
    return {
        reference: hash,
        path
    }
}
