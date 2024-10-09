import { createDefaultImage } from '../html/DefaultImage'
import { createFavicon } from '../html/Favicon'
import { createArticleFontData, createBrandingFontData, createNormalFontData } from '../html/Font'
import { createStyle } from '../html/Style'
import { createFrontPage } from '../page/FrontPage'
import { BlogState } from './BlogState'
import { SwarmState } from './SwarmState'
import { createArticleSlug } from './Utility'

export async function recreateMantaray(swarmState: SwarmState, blogState: BlogState): Promise<void> {
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
    for (const page of blogState.pages) {
        await collection.addHandle(page.path, await swarmState.swarm.newHandle(page.path, page.html, 'text/html'))
    }
    for (const article of blogState.articles) {
        await collection.addHandle(
            article.path,
            await swarmState.swarm.newHandle(article.path, article.html, 'text/html')
        )
    }
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
    await website.publish()
}
