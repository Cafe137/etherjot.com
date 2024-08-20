import { Optional } from 'cafe-utility'
import Swal from 'sweetalert2'
import { getFiles } from '../io/LoadSave'
import { GlobalState } from '../libetherjot'
import { Credentials } from '../type/Credentials'

interface Directory {
    name: string
    files: { name: string }[]
    directories: { name: string }[]
}

function addOptions(to: Record<string, string>, from: Directory) {
    for (const file of from.files) {
        to[file.name] = file.name
    }
    for (const directory of from.directories) {
        to[directory.name] = `/${directory.name}`
    }
}

export async function swalFiles(
    globalState: GlobalState,
    credentials: Credentials,
    pod: string,
    prefix = ''
): Promise<Optional<string>> {
    Swal.fire('Getting files...')
    Swal.showLoading()
    const files = await getFiles(globalState, credentials, pod, prefix)
    Swal.hideLoading()
    Swal.close()
    const inputOptions: Record<string, string> = {}
    addOptions(inputOptions, files)
    const result = await Swal.fire({
        title: 'Select a file',
        input: 'select',
        inputOptions,
        inputPlaceholder: 'Select a file',
        showCancelButton: true
    })
    if (!result.value) {
        return Optional.empty()
    }
    if (files.directories.some(x => x.name === result.value)) {
        return swalFiles(globalState, credentials, pod, `${prefix}/${result.value}`)
    }
    let fullPath = `${prefix}/${result.value}`
    while (fullPath.startsWith('//')) {
        fullPath = fullPath.substring(1)
    }
    return Optional.of(fullPath)
}
