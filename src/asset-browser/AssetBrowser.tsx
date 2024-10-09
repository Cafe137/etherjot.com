import { Binary, Strings, Types } from 'cafe-utility'
import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { assetBrowserChannel, onAssetAdded } from '../GlobalContext'
import { Modal } from '../Modal'
import { swalDirectories } from '../account/SwalFiles'
import { swalLogin } from '../account/SwalLogin'
import { swalPods } from '../account/SwalPods'
import { makeFdp } from '../io/FdpMaker'
import { BlogState } from '../libetherjot/engine/BlogState'
import { SwarmState } from '../libetherjot/engine/SwarmState'
import './AssetBrowser.css'
import { Thumbnail } from './Thumbnail'

interface Props {
    blogState: BlogState
    swarmState: SwarmState
}

export function AssetBrowser({ blogState, swarmState }: Props) {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        return assetBrowserChannel.subscribe(visible => {
            setVisible(visible)
        })
    }, [])

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
                            const hash = await (await swarmState.swarm.newRawData(byteArray, contentType)).save()
                            onAssetAdded.publish({
                                reference: hash,
                                contentType,
                                name: result.name
                            })
                            Swal.close()
                        }
                    })
                }
                reader.readAsDataURL(result)
            }
        })
    }

    async function onImportAsset() {
        ;(await swalLogin()).ifPresent(async credentials => {
            ;(await swalPods(swarmState, blogState, credentials)).ifPresent(async pod => {
                ;(await swalDirectories(swarmState, blogState, credentials, pod)).ifPresent(async fullPath => {
                    Swal.fire('Importing files...')
                    Swal.showLoading()
                    const fdp = await makeFdp(swarmState, blogState)
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
                        const hash = await (await swarmState.swarm.newRawData(byteArray, contentType)).save()
                        onAssetAdded.publish({
                            reference: hash,
                            contentType,
                            name: file.name
                        })
                    }
                    Swal.hideLoading()
                    Swal.close()
                })
            })
        })
    }

    if (!visible) {
        return null
    }

    return (
        <Modal
            title="Asset Browser"
            onClose={() => setVisible(false)}
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
                {blogState.assets.map(x => (
                    <Thumbnail key={x.reference} name={x.name} reference={x.reference} />
                ))}
            </div>
        </Modal>
    )
}
