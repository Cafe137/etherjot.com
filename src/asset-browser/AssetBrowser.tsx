import { Binary, Strings, Types } from 'cafe-utility'
import { useState } from 'react'
import Swal from 'sweetalert2'
import { Modal } from '../Modal'
import { save } from '../Saver'
import { swalDirectories } from '../account/SwalFiles'
import { swalLogin } from '../account/SwalLogin'
import { swalPods } from '../account/SwalPods'
import { makeFdp } from '../io/FdpMaker'
import { GlobalState } from '../libetherjot'
import './AssetBrowser.css'
import { Thumbnail } from './Thumbnail'

interface Props {
    globalState: GlobalState
    setGlobalState: (state: GlobalState) => void
    setShowAssetBrowser: (show: boolean) => void
    insertAsset: (reference: string) => void
}

export function AssetBrowser({ globalState, setGlobalState, setShowAssetBrowser, insertAsset }: Props) {
    const [_, rerender] = useState(0)

    async function onNewAsset() {
        await Swal.fire({
            title: 'Please Select Image File',
            input: 'file',
            inputAttributes: {
                accept: 'image/*',
                'aria-label': 'Select Image'
            },
            showLoaderOnConfirm: true,
            preConfirm: result => {
                const reader = new FileReader()
                reader.onload = event => {
                    if (!event.target) {
                        return
                    }
                    const dataUri = Types.asString(event.target.result)
                    const contentType = Strings.betweenNarrow(dataUri, 'data:', ';')
                    if (!contentType) {
                        throw Error('Could not determine content type')
                    }
                    const base64String = Strings.after(dataUri, 'base64,')
                    if (!base64String) {
                        throw Error('Could not determine base64 string')
                    }
                    const byteArray = Binary.base64ToUint8Array(base64String)
                    Swal.fire({
                        title: 'Uploading on Swarm...',
                        imageUrl: event.target.result as string,
                        imageHeight: 200,
                        imageWidth: 200,
                        imageAlt: 'The uploaded picture',
                        didOpen: async () => {
                            Swal.showLoading()
                            const hash = await (await globalState.swarm.newRawData(byteArray, contentType)).save()
                            globalState.assets.push({
                                reference: hash,
                                contentType,
                                name: result.name
                            })
                            await save(globalState)
                            Swal.close()
                            setGlobalState({ ...globalState })
                        }
                    })
                }
                reader.readAsDataURL(result)
            }
        })
    }

    async function onImportAsset() {
        ;(await swalLogin()).ifPresent(async credentials => {
            ;(await swalPods(globalState, credentials)).ifPresent(async pod => {
                ;(await swalDirectories(globalState, credentials, pod)).ifPresent(async fullPath => {
                    Swal.fire('Importing files...')
                    Swal.showLoading()
                    const fdp = await makeFdp(globalState)
                    await fdp.account.login(credentials.username, credentials.password)
                    const files = await fdp.directory.read(pod, fullPath)
                    for (const file of files.files) {
                        const byteArray = await fdp.file.downloadData(pod, `${fullPath}/${file.name}`)
                        let contentType = 'image/jpeg'
                        if (Types.isJpg(byteArray)) {
                            contentType = 'image/jpeg'
                        }
                        if (Types.isPng(byteArray)) {
                            contentType = 'image/png'
                        }
                        if (Types.isWebp(byteArray)) {
                            contentType = 'image/webp'
                        }
                        const hash = await (await globalState.swarm.newRawData(byteArray, contentType)).save()
                        globalState.assets.push({
                            reference: hash,
                            contentType,
                            name: file.name
                        })
                    }
                    await save(globalState)
                    setGlobalState({ ...globalState })
                    Swal.hideLoading()
                    Swal.close()
                })
            })
        })
    }

    return (
        <Modal
            title="Asset Browser"
            onClose={() => setShowAssetBrowser(false)}
            action={{
                label: 'Add New',
                callback: onNewAsset
            }}
            secondaryAction={{
                label: 'Import...',
                callback: onImportAsset
            }}
        >
            <div className="asset-browser-header">
                <p>Click on an image to insert it in the article.</p>
            </div>
            <div className="thumbnail-container">
                {globalState.assets.map(x => (
                    <Thumbnail
                        globalState={globalState}
                        key={x.reference}
                        name={x.name}
                        reference={x.reference}
                        insertAsset={insertAsset}
                        rerender={rerender}
                    />
                ))}
            </div>
        </Modal>
    )
}
