interface Props {
    children: React.ReactNode
}

export function Container({ children }: Props) {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: '16px',
                marginBottom: '16px',
                backgroundColor: '#f0f0f0',
                padding: '8px'
            }}
        >
            {children}
        </div>
    )
}
