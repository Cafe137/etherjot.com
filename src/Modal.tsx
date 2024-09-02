import { ReactNode } from 'react'
import { Button } from './Button'
import './Modal.css'

interface Action {
    label: string
    callback: () => void
}

interface Props {
    children: ReactNode
    onClose: () => void
    title: string
    action?: Action
    secondaryAction?: Action
}

export function Modal({ children, onClose, title, action, secondaryAction }: Props) {
    return (
        <div className="modal-wrapper">
            <div className="modal">
                {action && (
                    <div className="modal-action">
                        <Button onClick={action.callback}>{action.label}</Button>
                        {secondaryAction && (
                            <Button secondary onClick={secondaryAction.callback}>
                                {secondaryAction.label}
                            </Button>
                        )}
                    </div>
                )}
                <h2 className="modal-title">{title}</h2>
                <div className="modal-closer">
                    <Button secondary onClick={onClose}>
                        Close
                    </Button>
                </div>
                {children}
            </div>
        </div>
    )
}
