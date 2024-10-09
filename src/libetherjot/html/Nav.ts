import { BlogState } from '../engine/BlogState'
import { createArticleSlug } from '../engine/Utility'

export function createNav(blogState: BlogState, depth: number, active: string) {
    const categorySet = blogState.articles.reduce((categories, article) => {
        categories.add(article.category)
        return categories
    }, new Set<string>())
    const categories = ['Latest', ...[...categorySet].sort((a, b) => a.localeCompare(b))]
    return `<nav>${categories
        .map(
            x =>
                `<a href="${'../'.repeat(depth)}${createArticleSlug(x)}" class="${
                    active === x ? 'nav-item nav-item-active' : 'nav-item'
                }">${x}</a>`
        )
        .join('')}</nav>`
}
