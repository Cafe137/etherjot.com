import { ReactNode } from 'react'

interface Props {
    children: ReactNode
    size?: number
    bold?: boolean
}

export function Typography({ children, size, bold }: Props) {
    const style = {
        fontSize: size ? `${size}px` : '16px',
        margin: '0',
        fontWeight: bold ? 'bold' : 'normal'
    }

    return <p style={style}>{children}</p>
}
