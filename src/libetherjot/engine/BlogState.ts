import { Objects, Types } from 'cafe-utility'
import { Wallet, ethers } from 'ethers'
import { LocalStorageKeys } from '../../Persistence'
import { SwarmState } from './SwarmState'

export interface Asset {
    name: string
    contentType: string
    reference: string
}

export interface Configuration {
    sepolia: string
    title: string
    header: {
        title: string
        logo: string
        description: string
        linkLabel: string
        linkAddress: string
    }
    main: {
        highlight: string
    }
    footer: {
        description: string
        links: {
            discord: string
            twitter: string
            github: string
            youtube: string
            reddit: string
            linkedIn: string
        }
    }
    extensions: {
        ethereumAddress: string
        donations: boolean
        comments: boolean
    }
}

export interface Article {
    title: string
    preview: string
    markdown: string
    html: string
    category: string
    tags: string[]
    createdAt: number
    path: string
    banner: string
    kind: 'h1' | 'h2' | 'regular' | 'highlight'
    stamp: string
}

export interface BlogStateOnDisk {
    privateKey: string
    configuration: Configuration
    feed: string
    articles: Article[]
    collections: Record<string, string>
    assets: Asset[]
}

export interface BlogState {
    wallet: Wallet
    configuration: Configuration
    feed: string
    articles: Article[]
    collections: Record<string, string>
    assets: Asset[]
}

export function getBlogState(json: Record<string, any>): BlogState {
    const configuration = Types.asObject(json.configuration)
    const blogStateOnDisk: BlogStateOnDisk = {
        privateKey: Types.asString(json.privateKey),
        configuration: {
            sepolia: Types.asString(Objects.getDeep(configuration, 'sepolia') ?? 'https://sepolia.drpc.org'),
            title: Types.asString(configuration.title),
            header: {
                title: Types.asEmptiableString(Objects.getDeep(configuration, 'header.title') || ''),
                logo: Types.asEmptiableString(Objects.getDeep(configuration, 'header.logo') || ''),
                description: Types.asEmptiableString(Objects.getDeep(configuration, 'header.description') || ''),
                linkLabel: Types.asEmptiableString(Objects.getDeep(configuration, 'header.linkLabel') || ''),
                linkAddress: Types.asEmptiableString(Objects.getDeep(configuration, 'header.linkAddress') || '')
            },
            main: {
                highlight: Types.asEmptiableString(Objects.getDeep(configuration, 'main.highlight') || '')
            },
            footer: {
                description: Types.asEmptiableString(Objects.getDeep(configuration, 'footer.description') || ''),
                links: {
                    discord: Types.asEmptiableString(Objects.getDeep(configuration, 'footer.links.discord') || ''),
                    twitter: Types.asEmptiableString(Objects.getDeep(configuration, 'footer.links.twitter') || ''),
                    github: Types.asEmptiableString(Objects.getDeep(configuration, 'footer.links.github') || ''),
                    youtube: Types.asEmptiableString(Objects.getDeep(configuration, 'footer.links.youtube') || ''),
                    reddit: Types.asEmptiableString(Objects.getDeep(configuration, 'footer.links.reddit') || ''),
                    linkedIn: Types.asEmptiableString(Objects.getDeep(configuration, 'footer.links.linkedIn') || '')
                }
            },
            extensions: {
                ethereumAddress: Types.asEmptiableString(
                    Objects.getDeep(configuration, 'extensions.ethereumAddress') || ''
                ),
                donations: Types.asBoolean(Objects.getDeep(configuration, 'extensions.donations') || false),
                comments: Types.asBoolean(Objects.getDeep(configuration, 'extensions.comments') || false)
            }
        },
        feed: Types.asString(json.feed),
        articles: Types.asArray(json.articles).map((x: any) => {
            let kind: 'regular' | 'h1' | 'h2' = 'regular'
            if (x.kind === 'h1') {
                kind = 'h1'
            }
            if (x.kind === 'h2') {
                kind = 'h2'
            }
            return {
                title: Types.asString(x.title),
                preview: Types.asString(x.preview),
                markdown: Types.asString(x.markdown),
                html: Types.asString(x.html),
                category: Types.asString(x.category),
                tags: Types.asArray(x.tags || []).map(x => Types.asString(x)),
                createdAt: Types.asNumber(x.createdAt),
                path: Types.asString(x.path),
                banner: x.banner || null,
                kind,
                stamp: Types.asString(x.stamp)
            }
        }),
        collections: Types.asObject(json.collections || {}) as Record<string, string>,
        assets: Types.asArray(json.assets || []).map((x: any) => ({
            name: Types.asString(x.name),
            contentType: Types.asString(x.contentType),
            reference: Types.asString(x.reference)
        }))
    }
    return createBlogState(blogStateOnDisk)
}

export function saveBlogState(blogState: BlogState): BlogStateOnDisk {
    const blogStateOnDisk: BlogStateOnDisk = {
        privateKey: blogState.wallet.privateKey,
        configuration: blogState.configuration,
        feed: blogState.feed,
        articles: blogState.articles,
        collections: blogState.collections,
        assets: blogState.assets
    }
    localStorage.setItem(LocalStorageKeys.BLOG, JSON.stringify(blogStateOnDisk))
    return blogStateOnDisk
}

export async function createDefaultBlogState(websiteName: string, swarmState: SwarmState): Promise<BlogStateOnDisk> {
    const wallet = ethers.Wallet.createRandom()
    const collection = await swarmState.swarm.newCollection()
    await collection.addRawData('index.html', await swarmState.swarm.newRawData('hello', 'text/html'))
    await collection.save()
    const website = await swarmState.swarm.newWebsite(wallet.privateKey, collection)
    const feed = await website.generateAddress()
    await website.publish(0)
    const blogStateOnDisk: BlogStateOnDisk = {
        privateKey: wallet.privateKey,
        articles: [],
        feed,
        configuration: {
            sepolia: 'https://sepolia.drpc.org',
            title: websiteName,
            header: {
                title: '',
                logo: '',
                description: '',
                linkLabel: '',
                linkAddress: ''
            },
            main: {
                highlight: ''
            },
            footer: {
                description: '',
                links: {
                    discord: '',
                    twitter: '',
                    github: '',
                    youtube: '',
                    reddit: '',
                    linkedIn: ''
                }
            },
            extensions: {
                ethereumAddress: '',
                donations: false,
                comments: false
            }
        },
        collections: {},
        assets: []
    }
    return blogStateOnDisk
}

function createBlogState(blogStateOnDisk: BlogStateOnDisk): BlogState {
    const blogState: BlogState = {
        wallet: new ethers.Wallet(
            blogStateOnDisk.privateKey.startsWith('0x')
                ? blogStateOnDisk.privateKey.slice(2)
                : blogStateOnDisk.privateKey
        ),
        configuration: blogStateOnDisk.configuration,
        feed: blogStateOnDisk.feed,
        articles: blogStateOnDisk.articles,
        collections: blogStateOnDisk.collections,
        assets: blogStateOnDisk.assets
    }
    return blogState
}
