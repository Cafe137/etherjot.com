import { Asset } from '../engine/BlogState'

export function createImage(src: Asset, depth: number) {
    return `<img src="${'../'.repeat(depth)}${src.name}" />`
}
