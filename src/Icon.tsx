interface Props {
    src: string
    size: number
    onClick: () => void
}

export function Icon({ src, size, onClick }: Props) {
    return <img src={src} alt="icon" style={{ width: size, height: size, cursor: 'pointer' }} onClick={onClick} />
}
