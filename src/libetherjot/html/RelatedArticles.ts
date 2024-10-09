import { Article, BlogState } from '../engine/BlogState'
import { createPost } from './Post'

export function createRelatedArticles(
    blogState: BlogState,
    ignoreTitle: string,
    tags: string[],
    depth: number
): string | null {
    const articles = blogState.articles
        .filter(x => x.tags.some(tag => tags.includes(tag)))
        .filter(x => x.title !== ignoreTitle)
        .slice(0, 4)
    if (!articles.length) {
        return null
    }
    const innerHtml = `${articles.map(x => buildArticle(blogState, x, 'regular', depth)).join('\n')}`
    return `
    <div class="post-container post-container-regular">
        ${innerHtml}
    </div>
    `
}

function buildArticle(
    blogState: BlogState,
    x: Article,
    as: 'h1' | 'h2' | 'highlight' | 'regular',
    depth: number
): string {
    return createPost(
        blogState,
        x.title,
        x.preview,
        x.category,
        x.tags,
        x.createdAt,
        x.path.replace('post/', ''),
        x.banner || 'default.png',
        as,
        depth
    )
}
