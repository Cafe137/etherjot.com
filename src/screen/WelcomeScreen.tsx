import { Bee, PostageBatch } from '@ethersphere/bee-js'
import { Dates, System } from 'cafe-utility'
import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { Banner } from '../Banner'
import { Button } from '../Button'
import { EditIcon } from '../EditIcon'
import { onBlogCreate, screenChannel } from '../GlobalContext'
import { Horizontal } from '../Horizontal'
import { Screens } from '../Navigation'
import { SquareImage } from '../SquareImage'
import { TextInput } from '../TextInput'
import { Typography } from '../Typography'
import { Vertical } from '../Vertical'
import { createDefaultBlogState, getBlogState, saveBlogState } from '../libetherjot/engine/BlogState'
import { createSwarmState, saveSwarmState } from '../libetherjot/engine/SwarmState'

export function WelcomeScreen() {
    const [url, setUrl] = useState('http://localhost:1633')
    const [isBeeRunning, setBeeRunning] = useState(false)
    const [stamp, setStamp] = useState<PostageBatch | null>(null)
    const [blogName, setBlogName] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const bee = new Bee(url)
        return System.runAndSetInterval(() => {
            bee.checkConnection()
                .then(() => setBeeRunning(true))
                .catch(() => setBeeRunning(false))
        }, 5_000)
    }, [url])

    useEffect(() => {
        if (!isBeeRunning) {
            return
        }
        const bee = new Bee(url)
        bee.getAllPostageBatch().then(batches => {
            const usableBatch = batches.find(x => x.usable)
            if (usableBatch) {
                setStamp(usableBatch)
            }
        })
    }, [url, isBeeRunning])

    async function onCreate() {
        if (!stamp) {
            return
        }
        setLoading(true)
        const swarmState = createSwarmState({ beeApi: url, postageBatchId: stamp.batchID })
        const blogStateOnDisk = await createDefaultBlogState(blogName, swarmState)
        const blogState = getBlogState(blogStateOnDisk)
        saveSwarmState(swarmState)
        saveBlogState(blogState)
        onBlogCreate.publish()
        screenChannel.publish(Screens.EDITOR)
    }

    async function onEditUrl() {
        const newUrl = await Swal.fire({
            title: 'Enter your Bee node URL',
            input: 'text',
            inputValue: url,
            showCancelButton: true
        })
        if (!newUrl.isConfirmed) {
            return
        }
        setUrl(newUrl.value)
    }

    async function onEditStamp() {
        if (!isBeeRunning) {
            return
        }
        const bee = new Bee(url)
        const stamps = await bee.getAllPostageBatch()
        const inputOptions: Record<string, string> = {}
        for (const stamp of stamps) {
            inputOptions[stamp.batchID] = `${stamp.batchID} - ${stamp.depth} depth - ${Dates.secondsToHumanTime(
                stamp.batchTTL
            )}`
        }
        const result = await Swal.fire({
            title: 'Select a stamp',
            input: 'select',
            inputOptions,
            inputPlaceholder: 'Select a stamp',
            showCancelButton: true
        })
        if (!result.value) {
            return
        }
        const selectedStamp = stamps.find(x => x.batchID === result.value)
        if (!selectedStamp) {
            return
        }
        setStamp(selectedStamp)
    }

    return (
        <Horizontal full top p="32px" gap={32}>
            <Vertical gap={104} flex={1} color="#ffffff" p="32px">
                <Banner />
                <Vertical gap={32} left full>
                    <Typography>
                        Etherjot is an open source blog editor and static site generator built for the decentralized
                        internet with simplicity in mind.
                    </Typography>
                    <Typography>
                        <strong>Markdown syntax.</strong> Write your blog posts and take care of formatting in a
                        familiar way.
                    </Typography>
                    <Typography>
                        <strong>Organize your content.</strong> Use tags, categories and types to structurize your
                        posts.
                    </Typography>
                    <Typography>
                        <strong>Comments and community.</strong> Enable comments and let your readers engage with your
                        content or support hosting.
                    </Typography>
                    <Typography>
                        <strong>Made for Web3.</strong> Uses the Swarm network to store and host your blog out of the
                        box, no server required.
                    </Typography>
                    <Vertical full>
                        <Typography size={12}>
                            View source code and report issues at{' '}
                            <a href="https://github.com/ethersphere/etherjot-web" target="_blank">
                                github.com/ethersphere/etherjot-web
                            </a>
                        </Typography>
                    </Vertical>
                </Vertical>
            </Vertical>
            <Vertical gap={32} flex={1} color="#ffffff" p="32px">
                <Typography size={40} bold>
                    Get Started
                </Typography>
                <Vertical gap={32} left full>
                    <Vertical gap={16} left full>
                        <Typography size={20} bold>
                            Requirements
                        </Typography>
                        <Horizontal gap={8}>
                            <SquareImage size={32} src={isBeeRunning ? './assets/yes.png' : './assets/no.png'} />
                            <Vertical left>
                                <Typography>Bee node</Typography>
                                <Horizontal gap={8}>
                                    <Typography size={12} dim>
                                        {url}
                                    </Typography>
                                    <EditIcon onEdit={onEditUrl} />
                                </Horizontal>
                            </Vertical>
                        </Horizontal>
                        <Horizontal gap={8}>
                            <SquareImage size={32} src={stamp ? './assets/yes.png' : './assets/no.png'} />
                            <Vertical left>
                                <Typography>Postage batch</Typography>
                                <Horizontal gap={8}>
                                    <Typography size={12} dim>
                                        {stamp ? `${stamp.batchID.slice(0, 8)}...${stamp.batchID.slice(-8)}` : 'none'}
                                    </Typography>
                                    <EditIcon onEdit={onEditStamp} />
                                </Horizontal>
                            </Vertical>
                        </Horizontal>
                    </Vertical>
                    <Vertical gap={16} left full>
                        <Typography size={20} bold>
                            Important
                        </Typography>
                        <Horizontal gap={8}>
                            <SquareImage size={32} src={'./assets/info.png'} />
                            <Vertical left>
                                <Typography>Etherjot saves your blog on the Swarm network.</Typography>
                                <Typography bold>Keep your postage batch alive to avoid data loss.</Typography>
                            </Vertical>
                        </Horizontal>
                        <Horizontal gap={8}>
                            <SquareImage size={32} src={'./assets/info.png'} />
                            <Vertical left>
                                <Typography>Etherjot stores settings in the browser's local storage.</Typography>
                                <Typography bold>Back up your data regularly to avoid data loss.</Typography>
                            </Vertical>
                        </Horizontal>
                    </Vertical>
                    <Typography size={20} bold>
                        Ready?
                    </Typography>
                    <TextInput label="Enter your new web3 blog's name" value={blogName} setter={setBlogName} outline />
                    <Vertical full>
                        <Button onClick={onCreate} disabled={!blogName || !isBeeRunning || !stamp}>
                            {loading ? 'Creating...' : 'Create'}
                        </Button>
                    </Vertical>
                </Vertical>
            </Vertical>
        </Horizontal>
    )
}
