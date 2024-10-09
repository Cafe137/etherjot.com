import { ReactNode } from 'react'

interface Props {
    children: ReactNode
    size?: number
    bold?: boolean
    dim?: boolean
}

export function Typography({ children, size, bold, dim }: Props) {
    const style = {
        fontSize: size ? `${size}px` : '16px',
        margin: '0',
        fontWeight: bold ? 'bold' : 'normal',
        color: dim ? '#444' : '#000'
    }

    return <p style={style}>{children}</p>
}
