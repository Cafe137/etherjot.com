import { Arrays } from 'cafe-utility'
import { Article, BlogState } from '../engine/BlogState'
import { createPost } from './Post'

export function createPostContainer(blogState: BlogState, depth: number, filter?: string): string {
    if (filter) {
        const articles = blogState.articles.filter(x => x.category === filter || x.tags.includes(filter))
        return `
            <div class="post-container post-container-regular">
                ${articles.map(x => buildArticle(blogState, x, 'regular', depth)).join('\n')}
            </div>
        `
    }
    if (blogState.configuration.main.highlight) {
        const highlight = blogState.configuration.main.highlight
        for (const article of blogState.articles) {
            if (article.kind !== 'regular') {
                continue
            }
            if (article.category !== highlight) {
                continue
            }
            article.kind = 'highlight'
        }
    }
    const limits = {
        h1: 1,
        h2: 2,
        highlight: 4,
        regular: 12
    }
    const articles = Arrays.organiseWithLimits(
        blogState.articles,
        limits,
        'kind',
        'regular',
        (a, b) => b.createdAt - a.createdAt
    )
    const innerHtmlH1 = `${articles.h1.map(x => buildArticle(blogState, x, 'h1', depth)).join('\n')}`
    const innerHtmlRegular1 = `${articles.regular
        .slice(0, 4)
        .map(x => buildArticle(blogState, x, 'regular', depth))
        .join('\n')}`
    const innerHtmlH2 = `${articles.h2.map(x => buildArticle(blogState, x, 'h2', depth)).join('\n')}`
    const innerHtmlHighlight = `${articles.highlight
        .map(x => buildArticle(blogState, x, 'highlight', depth))
        .join('\n')}`
    const innerHtmlRegular2 = `${articles.regular
        .slice(4, 12)
        .map(x => buildArticle(blogState, x, 'regular', depth))
        .join('\n')}`
    return `
        ${innerHtmlH1 ? `<div class="post-container-h1">${innerHtmlH1}</div>` : ''}
        ${maybeSurround(blogState, innerHtmlRegular1, 'regular')}
        ${maybeSurround(blogState, innerHtmlH2, 'h2')}
        ${maybeSurround(blogState, innerHtmlHighlight, 'highlight')}
        ${maybeSurround(blogState, innerHtmlRegular2, 'regular')}
    `
}

function maybeSurround(blogState: BlogState, string: string, kind: string): string {
    if (string && kind === 'highlight') {
        return `
            <div class="highlight">
                <h2>${blogState.configuration.main?.highlight}</h2>
                <div class="post-container post-container-${kind}">
                    ${string}
                </div>
            </div>`
    }
    return string ? `<div class="post-container post-container-${kind}">${string}</div>` : ''
}

function buildArticle(
    blogState: BlogState,
    x: Article,
    as: 'h1' | 'h2' | 'highlight' | 'regular',
    depth: number
): string {
    return createPost(blogState, x.title, x.preview, x.category, x.tags, x.createdAt, x.path, x.banner, as, depth)
}
