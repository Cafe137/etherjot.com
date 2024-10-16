import { Bee } from '@ethersphere/bee-js'
import { Dates, Objects } from 'cafe-utility'
import { onLoadState } from '../../GlobalContext'
import { createDefaultImage } from '../html/DefaultImage'
import { createFavicon } from '../html/Favicon'
import { createArticleFontData, createBrandingFontData, createNormalFontData } from '../html/Font'
import { createStyle } from '../html/Style'
import { createArticlePage } from '../page/ArticlePage'
import { createFrontPage } from '../page/FrontPage'
import { BlogState } from './BlogState'
import { parseMarkdown } from './FrontMatter'
import { SwarmState } from './SwarmState'
import { createArticleSlug } from './Utility'

export async function recreateMantaray(swarmState: SwarmState, blogState: BlogState): Promise<void> {
    onLoadState.publish('Rebuilding website...')
    const collection = await swarmState.swarm.newCollection()
    await collection.addRawData(
        'font-variant-1.ttf',
        await swarmState.swarm.newRawData(createBrandingFontData(), 'font/ttf')
    )
    await collection.addRawData(
        'font-variant-2.woff2',
        await swarmState.swarm.newRawData(createNormalFontData(), 'font/woff2')
    )
    await collection.addRawData(
        'font-variant-3.ttf',
        await swarmState.swarm.newRawData(createArticleFontData(), 'font/ttf')
    )
    await collection.addRawData('style.css', await swarmState.swarm.newRawData(createStyle(), 'text/css'))
    await collection.addRawData('default.png', await swarmState.swarm.newRawData(createDefaultImage(), 'image/png'))
    await collection.addRawData('favicon.png', await swarmState.swarm.newRawData(createFavicon(), 'image/png'))
    await collection.addRawData('/', await createFrontPage(swarmState, blogState))
    await collection.addRawData('index.html', await createFrontPage(swarmState, blogState))
    blogState.articles = await Objects.mapAllAsync(blogState.articles, async article => {
        const bee = new Bee(swarmState.beeApi)
        const markdown = await bee.downloadFile(article.markdown)
        const newArticle = await createArticlePage(
            swarmState,
            blogState,
            article.title,
            parseMarkdown(markdown.data.text()),
            article.category,
            article.tags,
            article.banner,
            Dates.isoDate(new Date(article.createdAt)),
            article.kind
        )
        await collection.addHandle(
            newArticle.path,
            await swarmState.swarm.newHandle(newArticle.path, newArticle.html, 'text/html')
        )
        return newArticle
    })
    for (const collectionPage of Object.keys(blogState.collections)) {
        await collection.addHandle(
            createArticleSlug(collectionPage),
            await swarmState.swarm.newHandle(collectionPage, blogState.collections[collectionPage], 'text/html')
        )
    }
    for (const asset of blogState.assets) {
        await collection.addHandle(
            asset.name,
            await swarmState.swarm.newHandle(asset.name, asset.reference, asset.contentType)
        )
    }
    await collection.save()
    const website = await swarmState.swarm.newWebsite(blogState.wallet.privateKey, collection)
    onLoadState.publish('Publishing latest version...')
    await website.publish()
}
