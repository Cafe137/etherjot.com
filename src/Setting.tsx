import { TextareaInput } from './TextareaInput'
import { TextInput } from './TextInput'

interface Props {
    onChange: (value: string) => void
    title: string
    value: string
    type?: 'text' | 'textarea' | 'select'
    values?: { name: string; value: string }[]
}

export function Setting({ title, onChange, value, type = 'text', values }: Props) {
    return (
        <div>
            {type === 'text' && <TextInput setter={onChange} value={value} label={title} />}
            {type === 'textarea' && <TextareaInput setter={onChange} value={value} label={title} />}
            {type === 'select' && values && (
                <select onChange={event => onChange(event.target.value)} value={value}>
                    {values.map(x => (
                        <option key={x.value} value={x.value}>
                            {x.name}
                        </option>
                    ))}
                </select>
            )}
        </div>
    )
}
