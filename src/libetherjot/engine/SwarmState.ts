import { Types } from 'cafe-utility'
import { LocalStorageKeys } from '../../Persistence'
import { Swarm } from '../../libswarm/Swarm'

export interface SwarmStateOnDisk {
    beeApi: string
    postageBatchId: string
}

export interface SwarmState {
    beeApi: string
    postageBatchId: string
    swarm: Swarm
}

export function getSwarmState(json: Record<string, any>): SwarmState {
    const swarmStateOnDisk: SwarmStateOnDisk = {
        beeApi: Types.asString(json.beeApi),
        postageBatchId: Types.asEmptiableString(json.postageBatchId)
    }
    return createSwarmState(swarmStateOnDisk)
}

export function saveSwarmState(swarmState: SwarmState): SwarmStateOnDisk {
    const swarmStateOnDisk: SwarmStateOnDisk = {
        beeApi: swarmState.beeApi,
        postageBatchId: swarmState.postageBatchId
    }
    localStorage.setItem(LocalStorageKeys.SWARM, JSON.stringify(swarmStateOnDisk))
    return swarmStateOnDisk
}

export function createSwarmState(swarmStateOnDisk: SwarmStateOnDisk): SwarmState {
    const swarmState: SwarmState = {
        beeApi: swarmStateOnDisk.beeApi,
        postageBatchId: swarmStateOnDisk.postageBatchId,
        swarm: new Swarm({
            beeApi: swarmStateOnDisk.beeApi,
            postageBatchId: swarmStateOnDisk.postageBatchId || undefined
        })
    }
    return swarmState
}
