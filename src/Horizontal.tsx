interface Props {
    children: React.ReactNode
    p?: string
    gap?: number
    between?: boolean
    background?: string
    full?: boolean
    top?: boolean
}

export function Horizontal({ children, p = '0', gap = 8, between, background, full, top }: Props) {
    const style = {
        display: 'flex',
        flexDirection: 'row' as 'row',
        alignItems: top ? 'flex-start' : 'center',
        justifyContent: between ? 'space-between' : 'flex-start',
        gap: `${gap}px`,
        padding: p,
        background,
        width: full ? '100%' : 'auto'
    }

    return <div style={style}>{children}</div>
}
