import { Icon } from './Icon'

interface Props {
    onDelete: () => void
}

export function DeleteIcon({ onDelete }: Props) {
    return <Icon src="./assets/minus.svg" onClick={onDelete} size={20} />
}
