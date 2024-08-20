import { Typography } from './Typography'

interface Action {
    name: string
    onClick: () => void
}

interface Props {
    name: string
    actions: Action[]
}

export function MenuItem({ name, actions }: Props) {
    return (
        <div className="menu-item">
            <Typography size={14}>{name}</Typography>
            <div className="dropdown-menu">
                {actions.map((action, i) => (
                    <div key={i} className="dropdown-menu-item" onClick={action.onClick}>
                        <Typography size={14}>{action.name}</Typography>
                    </div>
                ))}
            </div>
        </div>
    )
}
