import { Optional } from 'cafe-utility'
import { useState } from 'react'
import Swal from 'sweetalert2'
import { Button } from './Button'
import { Container } from './Container'
import { Horizontal } from './Horizontal'
import { save } from './Saver'
import { Setting } from './Setting'
import { Asset, GlobalState } from './libetherjot'

interface Props {
    globalState: GlobalState
    setGlobalState: (state: GlobalState) => void
    setShowAssetPicker: (show: boolean) => void
    setAssetPickerCallback: (callback: (asset: Optional<Asset>) => void) => void
}

export function GlobalSettingsPage({ globalState, setGlobalState, setShowAssetPicker, setAssetPickerCallback }: Props) {
    const [title, setTitle] = useState(globalState.configuration.title)
    const [headerTitle, setHeaderTitle] = useState(globalState.configuration.header.title)
    const [headerLogo, setHeaderLogo] = useState(globalState.configuration.header.logo)
    const [headerDescription, setHeaderDescription] = useState(globalState.configuration.header.description)
    const [headerLinkLabel, setHeaderLinkLabel] = useState(globalState.configuration.header.linkLabel)
    const [headerLinkAddress, setHeaderLinkAddress] = useState(globalState.configuration.header.linkAddress)
    const [mainHighlight, setMainHighlight] = useState(globalState.configuration.main.highlight)
    const [footerDescription, setFooterDescription] = useState(globalState.configuration.footer.description)
    const [footerDiscord, setFooterDiscord] = useState(globalState.configuration.footer.links.discord)
    const [footerTwitter, setFooterTwitter] = useState(globalState.configuration.footer.links.twitter)
    const [footerGitHub, setFooterGitHub] = useState(globalState.configuration.footer.links.github)
    const [footerYouTube, setFooterYouTube] = useState(globalState.configuration.footer.links.youtube)
    const [footerReddit, setFooterReddit] = useState(globalState.configuration.footer.links.reddit)
    const [ethereumAddress, setEthereumAddress] = useState(globalState.configuration.extensions.ethereumAddress)
    const [donations, setDonations] = useState(globalState.configuration.extensions.donations)
    const [comments, setComments] = useState(globalState.configuration.extensions.comments)
    const [sepolia, setSepolia] = useState(globalState.configuration.sepolia)
    const [postageBatchId, setPostageBatchId] = useState(globalState.postageBatchId)

    async function onSave() {
        globalState.configuration.title = title
        globalState.configuration.header.title = headerTitle
        globalState.configuration.header.logo = headerLogo
        globalState.configuration.header.description = headerDescription
        globalState.configuration.header.linkLabel = headerLinkLabel
        globalState.configuration.header.linkAddress = headerLinkAddress
        globalState.configuration.main.highlight = mainHighlight
        globalState.configuration.footer.description = footerDescription
        globalState.configuration.footer.links.discord = footerDiscord
        globalState.configuration.footer.links.twitter = footerTwitter
        globalState.configuration.footer.links.github = footerGitHub
        globalState.configuration.footer.links.youtube = footerYouTube
        globalState.configuration.footer.links.reddit = footerReddit
        globalState.configuration.extensions.ethereumAddress = ethereumAddress
        globalState.configuration.extensions.donations = donations
        globalState.configuration.extensions.comments = comments
        globalState.configuration.sepolia = sepolia
        globalState.postageBatchId = postageBatchId
        await save(globalState)
        setGlobalState({ ...globalState })
        Swal.fire({
            title: 'Saved!',
            timer: 1000,
            timerProgressBar: true
        })
    }

    return (
        <div className="global-settings">
            <h2>Website</h2>
            <Container>
                <Setting title="Title" value={title} onChange={setTitle} />
            </Container>
            <h2>Header</h2>
            <Container>
                <Setting title="Title" value={headerTitle} onChange={setHeaderTitle} />
                <Setting title="Link Label" value={headerLinkLabel} onChange={setHeaderLinkLabel} />
                <Setting title="Link Address" value={headerLinkAddress} onChange={setHeaderLinkAddress} />
                <div>
                    <p style={{ paddingLeft: '8px', paddingBottom: '8px' }}>Logo</p>
                    {headerLogo && (
                        <div>
                            <img
                                src={`http://localhost:1633/bytes/${headerLogo}`}
                                style={{ width: '48px', height: '48px' }}
                            />
                        </div>
                    )}
                    <Button
                        onClick={() => {
                            setAssetPickerCallback(() => (asset: Optional<Asset>) => {
                                asset.ifPresent(a => {
                                    setHeaderLogo(a.reference)
                                })
                                setShowAssetPicker(false)
                            })
                            setShowAssetPicker(true)
                        }}
                    >
                        Pick
                    </Button>
                </div>
                <Setting
                    title="Description"
                    type="textarea"
                    value={headerDescription}
                    onChange={setHeaderDescription}
                />
            </Container>
            <h2>Front page</h2>
            <Container>
                <Setting title="Highlight" value={mainHighlight} onChange={setMainHighlight} />
            </Container>
            <h2>Footer</h2>
            <Container>
                <Setting
                    title="Description"
                    type="textarea"
                    value={footerDescription}
                    onChange={setFooterDescription}
                />
            </Container>
            <h2>Social Links</h2>
            <Container>
                <Setting title="Discord" value={footerDiscord} onChange={setFooterDiscord} />
                <Setting title="Twitter" value={footerTwitter} onChange={setFooterTwitter} />
                <Setting title="GitHub" value={footerGitHub} onChange={setFooterGitHub} />
                <Setting title="YouTube" value={footerYouTube} onChange={setFooterYouTube} />
                <Setting title="Reddit" value={footerReddit} onChange={setFooterReddit} />
            </Container>
            <h2>Swarm</h2>
            <Container>
                <Setting title="Postage Batch ID" value={postageBatchId} onChange={setPostageBatchId} />
            </Container>
            <h2>Extensions</h2>
            <Container>
                <Setting title="Ethereum Address" value={ethereumAddress} onChange={setEthereumAddress} />
                <Horizontal gap={8}>
                    <input onChange={event => setDonations(event.target.checked)} type="checkbox" checked={donations} />
                    Enable taking donations
                </Horizontal>
                <Horizontal gap={8}>
                    <input onChange={event => setComments(event.target.checked)} type="checkbox" checked={comments} />
                    Enable comments
                </Horizontal>
            </Container>
            <h2>FDP Storage</h2>
            <Container>
                <Setting title="Sepolia JSON-RPC" value={sepolia} onChange={setSepolia} />
            </Container>
            <h2>Apply changes</h2>
            <Button onClick={onSave}>Save</Button>
        </div>
    )
}
