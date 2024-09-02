import { Typography } from './Typography'
import { Vertical } from './Vertical'

interface Props {
    label: string
    value: string
    setter: (value: string) => void
    required?: boolean
}

export function TextareaInput({ label, value, setter, required }: Props) {
    return (
        <Vertical gap={4} left full>
            <Typography size={15} bold={required}>
                {label}
                {required && '*'}
            </Typography>
            <textarea className="etherjot-input" value={value} onChange={e => setter(e.target.value)} />
        </Vertical>
    )
}
