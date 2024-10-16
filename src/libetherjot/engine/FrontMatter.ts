import { Dates, Strings, Types } from 'cafe-utility'
import { load } from 'js-yaml'
import toml from 'toml'

export interface ParsedMarkdown {
    raw: string
    attributes: Record<string, unknown>
    body: string
}

export function parseMarkdown(markdown: string): ParsedMarkdown {
    markdown = markdown.trim()
    if (markdown.startsWith('---')) {
        const metadata = Strings.extractBlock(markdown, { opening: '---', closing: '---', exclusive: true })
        if (!metadata) {
            return {
                raw: markdown,
                attributes: {},
                body: markdown
            }
        }
        const attributes = load(metadata)
        const body = markdown.substring(metadata.length + 6).trim()
        return {
            raw: markdown,
            attributes: Types.asObject(attributes || {}),
            body
        }
    }
    if (markdown.startsWith('+++')) {
        const metadata = Strings.extractBlock(markdown, { opening: '+++', closing: '+++', exclusive: true })
        if (!metadata) {
            return {
                raw: markdown,
                attributes: {},
                body: markdown
            }
        }
        const attributes = toml.parse(metadata)
        const body = markdown.substring(metadata.length + 6).trim()
        return {
            raw: markdown,
            attributes,
            body
        }
    }
    return {
        raw: markdown,
        attributes: {},
        body: markdown
    }
}

export class ParsedMarkdownReader {
    constructor(private parsed: ParsedMarkdown) {}

    titleOr(fallback: string): string {
        return Types.isString(this.parsed.attributes.title) ? this.parsed.attributes.title : fallback
    }

    unwrap(): ParsedMarkdown {
        return this.parsed
    }

    categoryOr(fallback: string): string {
        return Types.isString(this.parsed.attributes.category) ? this.parsed.attributes.category : fallback
    }

    tags(): string[] {
        return Types.isString(this.parsed.attributes.tags)
            ? [this.parsed.attributes.tags]
            : Array.isArray(this.parsed.attributes.tags)
            ? this.parsed.attributes.tags
            : []
    }

    banner(): string {
        return Types.isString(this.parsed.attributes.banner) ? this.parsed.attributes.banner : 'default.png'
    }

    date(): string {
        return Types.isNumber(this.parsed.attributes.date)
            ? Dates.isoDate(new Date(this.parsed.attributes.date))
            : Dates.isoDate()
    }

    type(): 'regular' | 'h1' | 'h2' | 'highlight' {
        return ['regular', 'h1', 'h2', 'highlight'].includes(this.parsed.attributes.type as any)
            ? (this.parsed.attributes.type as 'regular' | 'h1' | 'h2' | 'highlight')
            : 'regular'
    }
}
