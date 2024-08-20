import { Optional } from 'cafe-utility'
import Swal from 'sweetalert2'
import { getPods } from '../io/LoadSave'
import { GlobalState } from '../libetherjot'
import { Credentials } from '../type/Credentials'

export async function swalPods(globalState: GlobalState, credentials: Credentials): Promise<Optional<string>> {
    Swal.fire('Getting pods...')
    Swal.showLoading()
    const pods = await getPods(globalState, credentials)
    Swal.hideLoading()
    const inputOptions: Record<string, string> = {}
    for (const pod of pods) {
        inputOptions[pod.name] = pod.name
    }
    const result = await Swal.fire({
        title: 'Select a pod',
        input: 'select',
        inputOptions,
        inputPlaceholder: 'Select a pod',
        showCancelButton: true
    })
    if (!result.value) {
        return Optional.empty()
    }
    return Optional.of(result.value)
}
