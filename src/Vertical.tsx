interface Props {
    children: React.ReactNode
    gap?: number
    left?: boolean
    full?: boolean
    flex?: number
    color?: string
    p?: string
}

export function Vertical({ children, gap = 0, left = false, full = false, flex, color, p }: Props) {
    const style = {
        display: 'flex',
        flexDirection: 'column' as 'column',
        alignItems: left ? 'flex-start' : 'center',
        gap: `${gap}px`,
        flex,
        width: full ? '100%' : 'auto',
        background: color,
        padding: p
    }

    return <div style={style}>{children}</div>
}
