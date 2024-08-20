interface Props {
    children: React.ReactNode
    p?: string
    gap?: number
    between?: boolean
    background?: string
    borderRadius?: number
}

export function Horizontal({ children, p = '0', gap = 8, between, background, borderRadius }: Props) {
    const style = {
        display: 'flex',
        flexDirection: 'row' as 'row',
        alignItems: 'center',
        justifyContent: between ? 'space-between' : 'flex-start',
        gap: `${gap}px`,
        padding: p,
        background,
        borderRadius: `${borderRadius}px`
    }

    return <div style={style}>{children}</div>
}
