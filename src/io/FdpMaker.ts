import { FdpStorage } from '@fairdatasociety/fdp-storage'
import { BlogState } from '../libetherjot/engine/BlogState'
import { SwarmState } from '../libetherjot/engine/SwarmState'

export async function makeFdp(swarmState: SwarmState, blogState: BlogState): Promise<FdpStorage> {
    const fdp = new FdpStorage(
        swarmState.beeApi,
        (swarmState.postageBatchId || (await swarmState.swarm.mustGetUsableStamp())) as any,
        {
            ensOptions: {
                rpcUrl: blogState.configuration.sepolia,
                contractAddresses: {
                    ensRegistry: '0x42a96D45d787685ac4b36292d218B106Fb39be7F',
                    fdsRegistrar: '0xFBF00389140C00384d88d458239833E3231a7414',
                    nameResolver: '0xE20ECe6Ea93c4edE41e4d3B973f6679F1E89986A',
                    publicResolver: '0xC904989B579c2B216A75723688C784038AA99B56',
                    reverseResolver: '0xbDC8D98d3cbFd68EA9c165E1f15Df6e77A2ae0C5'
                },
                gasEstimation: 1,
                performChecks: true
            },
            providerOptions: {
                url: blogState.configuration.sepolia
            },
            ensDomain: 'fds'
        }
    )
    return fdp
}
