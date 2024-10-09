import { BlogState } from '../engine/BlogState'
import { createImage } from './Image'
import { createLogoSvg } from './LogoSvg'
import { createNav } from './Nav'

export async function createHeader(blogState: BlogState, depth: number, active: string, variant = 'h1') {
    const title = blogState.configuration.header.title || blogState.configuration.title
    const description = blogState.configuration.header.description
    const linkLabel = blogState.configuration.header.linkLabel
    const linkAddress = blogState.configuration.header.linkAddress
    const descriptionHtml = description ? `<p class="blog-description">${description}</p>` : ''
    const linkHtml =
        linkLabel && linkAddress
            ? `<div class="blog-link">
            <a href="${linkAddress}" target="_blank">${linkLabel}</a>
        </div>`
            : ''
    const logo = blogState.configuration.header.logo
        ? blogState.assets.find(x => x.reference === blogState.configuration.header.logo)
        : null

    return `
    <header>
        <div class="content-area">
            <div class="header-top-row">
                <a href="${'../'.repeat(depth)}">
                    <div class="blog-name-row">
                        ${logo ? createImage(logo, depth) : createLogoSvg()}
                        <${variant} class="blog-name">${title}</${variant}>
                    </div>
                </a>
                <div class="row">
                    ${linkHtml}
                </div>
            </div>
            ${descriptionHtml}
            ${createNav(blogState, depth, active)}
        </div>
    </header>`
}
