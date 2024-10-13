import { Typography } from './Typography'
import { Vertical } from './Vertical'

interface Props {
    label: string
    value: string
    setter: (value: string) => void
    password?: boolean
    required?: boolean
    disabled?: boolean
    outline?: boolean
    hint?: string
}

export function TextInput({ label, value, setter, password, required, disabled, outline, hint }: Props) {
    return (
        <Vertical gap={4} left full>
            <Typography size={15} bold={required}>
                {label}
                {required && '*'}
            </Typography>
            <input
                className="etherjot-input"
                style={{
                    border: outline ? '1px solid #202020' : 'none'
                }}
                type={password ? 'password' : 'text'}
                value={value}
                onChange={e => setter(e.target.value)}
                disabled={disabled}
            />
            {hint && (
                <Typography size={12} dim>
                    {hint}
                </Typography>
            )}
        </Vertical>
    )
}
