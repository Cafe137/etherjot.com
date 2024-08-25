interface Props {
    children: React.ReactNode
    p?: string
    gap?: number
    between?: boolean
    background?: string
}

export function Horizontal({ children, p = '0', gap = 8, between, background }: Props) {
    const style = {
        display: 'flex',
        flexDirection: 'row' as 'row',
        alignItems: 'center',
        justifyContent: between ? 'space-between' : 'flex-start',
        gap: `${gap}px`,
        padding: p,
        background
    }

    return <div style={style}>{children}</div>
}
