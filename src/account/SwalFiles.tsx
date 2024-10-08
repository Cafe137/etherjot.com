import { Optional } from 'cafe-utility'
import Swal from 'sweetalert2'
import { getFiles } from '../io/LoadSave'
import { BlogState } from '../libetherjot/engine/BlogState'
import { SwarmState } from '../libetherjot/engine/SwarmState'
import { Credentials } from '../type/Credentials'

interface Directory {
    name: string
    files: { name: string }[]
    directories: { name: string }[]
}

function addOptions(to: Record<string, string>, from: Directory, directoriesOnly = false) {
    if (!directoriesOnly) {
        for (const file of from.files) {
            to[file.name] = file.name
        }
    }
    for (const directory of from.directories) {
        to[directory.name] = `/${directory.name}`
    }
}

export async function swalDirectories(
    swarmState: SwarmState,
    blogState: BlogState,
    credentials: Credentials,
    pod: string,
    prefix = ''
) {
    Swal.fire('Getting files...')
    Swal.showLoading()
    const files = await getFiles(swarmState, blogState, credentials, pod, prefix)
    Swal.hideLoading()
    Swal.close()
    const inputOptions: Record<string, string> = {}
    addOptions(inputOptions, files, true)
    const result = await Swal.fire({
        title: 'Select a directory',
        input: 'select',
        inputOptions,
        inputPlaceholder: 'Select a directory',
        showCancelButton: true
    })
    if (!result.value) {
        return Optional.empty<string>()
    }
    let fullPath = `${prefix}/${result.value}`
    while (fullPath.startsWith('//')) {
        fullPath = fullPath.substring(1)
    }
    return Optional.of(fullPath)
}

export async function swalFiles(
    swarmState: SwarmState,
    blogState: BlogState,
    credentials: Credentials,
    pod: string,
    prefix = ''
): Promise<Optional<string>> {
    Swal.fire('Getting files...')
    Swal.showLoading()
    const files = await getFiles(swarmState, blogState, credentials, pod, prefix)
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
        return swalFiles(swarmState, blogState, credentials, pod, `${prefix}/${result.value}`)
    }
    let fullPath = `${prefix}/${result.value}`
    while (fullPath.startsWith('//')) {
        fullPath = fullPath.substring(1)
    }
    return Optional.of(fullPath)
}
