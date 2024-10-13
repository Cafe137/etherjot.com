import { TextareaInput } from './TextareaInput'
import { TextInput } from './TextInput'
import { Typography } from './Typography'
import { Vertical } from './Vertical'

interface Props {
    onChange: (value: string) => void
    title: string
    value: string
    type?: 'text' | 'textarea' | 'select'
    values?: { name: string; value: string }[]
    hint?: string
}

export function Setting({ title, onChange, value, type = 'text', values, hint }: Props) {
    return (
        <Vertical gap={4} left full>
            {type === 'text' && <TextInput setter={onChange} value={value} label={title} />}
            {type === 'textarea' && <TextareaInput setter={onChange} value={value} label={title} />}
            {type === 'select' && values && (
                <>
                    <Typography size={15}>{title}</Typography>
                    <select className="etherjot-input" onChange={event => onChange(event.target.value)} value={value}>
                        {values.map(x => (
                            <option key={x.value} value={x.value}>
                                {x.name}
                            </option>
                        ))}
                    </select>
                </>
            )}
            {hint && (
                <Typography size={12} dim>
                    {hint}
                </Typography>
            )}
        </Vertical>
    )
}
