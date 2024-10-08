import { useEffect, useState } from 'react'
import { Button } from '../Button'
import { assetPickChannel, assetPickerChannel, onConfigurationChange } from '../GlobalContext'
import { Horizontal } from '../Horizontal'
import { BlogState } from '../libetherjot/engine/BlogState'
import { SwarmState } from '../libetherjot/engine/SwarmState'
import { MenuBar } from '../MenuBar'
import { Setting } from '../Setting'
import { Typography } from '../Typography'
import { Vertical } from '../Vertical'

interface Props {
    swarmState: SwarmState
    blogState: BlogState
}

export function SettingsScreen({ swarmState, blogState }: Props) {
    const [title, setTitle] = useState(blogState.configuration.title)
    const [headerTitle, setHeaderTitle] = useState(blogState.configuration.header.title)
    const [headerLogo, setHeaderLogo] = useState(blogState.configuration.header.logo)
    const [headerDescription, setHeaderDescription] = useState(blogState.configuration.header.description)
    const [headerLinkLabel, setHeaderLinkLabel] = useState(blogState.configuration.header.linkLabel)
    const [headerLinkAddress, setHeaderLinkAddress] = useState(blogState.configuration.header.linkAddress)
    const [mainHighlight, setMainHighlight] = useState(blogState.configuration.main.highlight)
    const [footerDescription, setFooterDescription] = useState(blogState.configuration.footer.description)
    const [footerDiscord, setFooterDiscord] = useState(blogState.configuration.footer.links.discord)
    const [footerTwitter, setFooterTwitter] = useState(blogState.configuration.footer.links.twitter)
    const [footerGitHub, setFooterGitHub] = useState(blogState.configuration.footer.links.github)
    const [footerYouTube, setFooterYouTube] = useState(blogState.configuration.footer.links.youtube)
    const [footerReddit, setFooterReddit] = useState(blogState.configuration.footer.links.reddit)
    const [ethereumAddress, setEthereumAddress] = useState(blogState.configuration.extensions.ethereumAddress)
    const [donations, setDonations] = useState(blogState.configuration.extensions.donations)
    const [comments, setComments] = useState(blogState.configuration.extensions.comments)
    const [sepolia, setSepolia] = useState(blogState.configuration.sepolia)

    async function onSave() {
        onConfigurationChange.publish({
            title,
            header: {
                title: headerTitle,
                logo: headerLogo,
                description: headerDescription,
                linkLabel: headerLinkLabel,
                linkAddress: headerLinkAddress
            },
            main: {
                highlight: mainHighlight
            },
            footer: {
                description: footerDescription,
                links: {
                    discord: footerDiscord,
                    twitter: footerTwitter,
                    github: footerGitHub,
                    youtube: footerYouTube,
                    reddit: footerReddit
                }
            },
            extensions: {
                ethereumAddress,
                donations,
                comments
            },
            sepolia
        })
    }

    useEffect(() => {
        return assetPickChannel.subscribe(asset => {
            asset.ifPresent(a => {
                setHeaderLogo(a.reference)
            })
        })
    }, [])

    return (
        <>
            <MenuBar blogState={blogState} swarmState={swarmState} />
            <Horizontal full gap={16} p="16px" top>
                <Vertical p="16px" gap={16} left flex={1} color="#f0f0f0">
                    <h2>Website</h2>
                    <Setting
                        title="Browser Tab Title"
                        value={title}
                        onChange={setTitle}
                        hint='This is the equavilent of the "title" tag in HTML'
                    />
                    <h2>Header</h2>
                    <Setting
                        title="Title"
                        value={headerTitle}
                        onChange={setHeaderTitle}
                        hint="This is the title that appears at the top of the page"
                    />
                    <Setting
                        title="Link Label"
                        value={headerLinkLabel}
                        onChange={setHeaderLinkLabel}
                        hint="Also requires Link Address"
                    />
                    <Setting
                        title="Link Address"
                        value={headerLinkAddress}
                        onChange={setHeaderLinkAddress}
                        hint="Also requires Link Label"
                    />
                    <Vertical gap={4} left>
                        <Typography>Logo</Typography>
                        {headerLogo && (
                            <div>
                                <img
                                    src={`http://localhost:1633/bytes/${headerLogo}`}
                                    style={{ width: '48px', height: '48px' }}
                                />
                            </div>
                        )}
                        <Button onClick={() => assetPickerChannel.publish(true)}>Pick</Button>
                    </Vertical>
                    <Setting
                        title="Description"
                        type="textarea"
                        value={headerDescription}
                        onChange={setHeaderDescription}
                        hint="This is the description that appears below the title"
                    />
                </Vertical>
                <Vertical p="16px" gap={16} left flex={1} color="#f0f0f0">
                    <h2>Front page</h2>
                    <Setting
                        title="Highlight"
                        value={mainHighlight}
                        onChange={setMainHighlight}
                        hint="This is a category that will be highlighted on the front page"
                    />
                    <h2>Footer</h2>
                    <Setting
                        title="Description"
                        type="textarea"
                        value={footerDescription}
                        onChange={setFooterDescription}
                        hint="This is the description that appears at the bottom of the page"
                    />
                    <h2>Extensions</h2>
                    <Setting
                        title="Ethereum Address"
                        value={ethereumAddress}
                        onChange={setEthereumAddress}
                        hint="This is the Ethereum address that will be used for donations"
                    />
                    <Horizontal gap={8}>
                        <input
                            onChange={event => setDonations(event.target.checked)}
                            type="checkbox"
                            checked={donations}
                        />
                        Enable taking donations
                    </Horizontal>
                    <Horizontal gap={8}>
                        <input
                            onChange={event => setComments(event.target.checked)}
                            type="checkbox"
                            checked={comments}
                        />
                        Enable comments
                    </Horizontal>
                </Vertical>
                <Vertical p="16px" gap={16} left flex={1} color="#f0f0f0">
                    <h2>Social Links</h2>
                    <Setting title="Discord" value={footerDiscord} onChange={setFooterDiscord} />
                    <Setting title="Twitter" value={footerTwitter} onChange={setFooterTwitter} />
                    <Setting title="GitHub" value={footerGitHub} onChange={setFooterGitHub} />
                    <Setting title="YouTube" value={footerYouTube} onChange={setFooterYouTube} />
                    <Setting title="Reddit" value={footerReddit} onChange={setFooterReddit} />
                    <h2>FDP Storage</h2>
                    <Setting title="Sepolia JSON RPC" value={sepolia} onChange={setSepolia} />
                    <h2>Apply changes</h2>
                    <Button onClick={onSave}>Save</Button>
                </Vertical>
            </Horizontal>
        </>
    )
}
