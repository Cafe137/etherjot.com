import { BlogState } from '../engine/BlogState'
import { createDiscordSvg } from './DiscordSvg'
import { createGithubSvg } from './GithubSvg'
import { createHomeSvg } from './HomeSvg'
import { createLinkedinSvg } from './LinkedinSvg'
import { createRedditSvg } from './RedditSvg'
import { createSwarmSvg } from './SwarmSvg'
import { createTwitterSvg } from './TwitterSvg'
import { createYoutubeSvg } from './YoutubeSvg'

export async function createFooter(blogState: BlogState) {
    const footer = blogState.configuration.footer
    const descriptionHtml = footer.description ? `<p class="footer-description">${footer.description}</p>` : ''
    const discordHtml = footer.links.discord ? createLinkSvg(createDiscordSvg(), 'Discord', footer.links.discord) : ''
    const githubHtml = footer.links.github ? createLinkSvg(createGithubSvg(), 'GitHub', footer.links.github) : ''
    const twitterHtml = footer.links.twitter ? createLinkSvg(createTwitterSvg(), 'Twitter', footer.links.twitter) : ''
    const redditHtml = footer.links.reddit ? createLinkSvg(createRedditSvg(), 'Reddit', footer.links.reddit) : ''
    const youtubeHtml = footer.links.youtube ? createLinkSvg(createYoutubeSvg(), 'YouTube', footer.links.youtube) : ''
    const linkedInHtml = footer.links.linkedIn
        ? createLinkSvg(createLinkedinSvg(), 'LinkedIn', footer.links.linkedIn)
        : ''
    const linkHtml = blogState.configuration.header.linkAddress
        ? `<a class="footer-link" href="${
              blogState.configuration.header.linkAddress
          }" target="_blank">${createHomeSvg()} Visit website</a>`
        : ''

    return `
    <footer>
        <div class="grid-container content-area">
            <div class="grid-3 footer-info">
                ${createSwarmSvg()}${descriptionHtml}
            </div>
            <div class="grid-3">
            </div>
            <div class="grid-3">
                ${linkHtml}
            </div>
            <div class="grid-3 footer-links">
                ${discordHtml}
                ${githubHtml}
                ${twitterHtml}
                ${redditHtml}
                ${youtubeHtml}
                ${linkedInHtml}
            </div>
        </div>
    </footer>`
}

function createLinkSvg(svg: string, label: string, url: string) {
    return `<a class="footer-link" href="${url}" target="_blank">${svg} ${label}</a>`
}
