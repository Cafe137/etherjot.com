import { Icon } from './Icon'

interface Props {
    onEdit: () => void
}

export function EditIcon({ onEdit }: Props) {
    return <Icon src="./assets/edit.svg" onClick={onEdit} size={20} />
}
