import { useState } from 'react'
import { Button } from './Button'
import { Horizontal } from './Horizontal'
import { GlobalState, createDefaultGlobalState, getGlobalState } from './libetherjot'
import { save } from './Saver'
import { SquareImage } from './SquareImage'
import { Vertical } from './Vertical'
import './WelcomePage.css'

interface Props {
    setGlobalState: (state: GlobalState) => void
    isBeeRunning: boolean
    hasPostageStamp: boolean
}

export function WelcomePage({ setGlobalState, isBeeRunning, hasPostageStamp }: Props) {
    const [blogName, setBlogName] = useState('')
    const [accepted, setAccepted] = useState(false)
    const [loading, setLoading] = useState(false)

    function onClick() {
        setLoading(true)
        createDefaultGlobalState(blogName)
            .then(json => getGlobalState(json))
            .then(async x => {
                await save(x)
                setGlobalState(x)
            })
    }

    return (
        <>
            <div className="welcome-page">
                <Vertical gap={16}>
                    <Horizontal gap={0}>
                        <h1>Ether</h1>
                        <Vertical gap={10}>
                            <div />
                            <SquareImage size={80} src="./assets/etherjot.png" />
                        </Vertical>
                        <h1>ot</h1>
                    </Horizontal>
                    <Horizontal>
                        Powered by{' '}
                        <svg height="28" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4222.16 1115">
                            <path d="M0 665.01V965l260 150 260-150.01V664.96L260 515 0 665.01zM855 515 595 665v299.99L855 1115l260-150.01V664.95L855 515zM817.32 300.27l-129.91-75.25-.13-149.98L557.5 0 297.68 150.01V450L557.5 600l259.82-150V300.27z"></path>
                            <path d="m817.32 300.27 129.91-75.3V75L817.52 0 687.28 75.04l130.24 74.83-.2 150.4z"></path>
                            <g>
                                <path d="m2415.53 300.74-63.56 442.98c-.1.73-1.16.72-1.25-.01l-55.85-442.95a.63.63 0 0 0-.63-.55h-158.41a.64.64 0 0 0-.63.55l-55.85 442.99c-.09.73-1.15.74-1.25.01l-63.56-443.01a.63.63 0 0 0-.63-.54h-96.57a.63.63 0 0 0-.62.73l80.61 512.59c.05.31.31.53.62.53h158.16c.32 0 .59-.24.63-.55l57.68-442.16c.1-.73 1.16-.73 1.25 0l57.67 442.16c.04.31.31.55.63.55h158.16c.31 0 .58-.23.62-.53l80.61-512.59a.63.63 0 0 0-.62-.73h-96.58a.64.64 0 0 0-.63.54ZM4189.53 324.76c-22.01-25.59-53.37-38.57-93.2-38.57-50.94 0-89.06 22.89-113.39 68.06h-.38c-6.8-18.86-18-34.68-33.35-47.1-17.22-13.9-39.1-20.95-65.04-20.95-24.32 0-45.81 6.04-63.86 17.96-15.22 10.05-27.46 24.82-36.48 44.02v-47.33a.63.63 0 0 0-.63-.63h-94.28a.63.63 0 0 0-.63.63v512.58c0 .35.28.63.63.63h94.28c.35 0 .63-.28.63-.63V463.06c0-25.95 5.98-47.08 17.77-62.81 11.37-15.15 27.25-22.51 48.55-22.51 17.46 0 30.98 6.01 41.33 18.38 10.75 12.85 15.98 28.86 15.98 48.93v368.38c0 .35.28.63.63.63h94.28c.35 0 .63-.28.63-.63V469.06c0-31.75 6.22-55.29 18.48-69.94 12.04-14.39 27.36-21.39 46.83-21.39 20.53 0 34.89 6.16 43.91 18.83 9.55 13.45 14.39 31.1 14.39 52.48v364.37c0 .35.28.63.63.63h94.92V423.03c0-39.98-10.98-73.04-32.64-98.27ZM3084.49 758.16l-59.73 66.7a.64.64 0 0 1-.9.06l-105.21-91.18a.65.65 0 0 0-.75-.07l-125.83 73.49c-21.21 12.12-43.43 18.18-67.66 18.18-35.35 0-67.66-13.12-95.94-38.37-27.27-26.26-41.41-58.58-41.41-97.96 0-47.46 25.25-93.92 68.67-118.16l254.16-146.24c.2-.11.32-.33.32-.56v-32.32a.64.64 0 0 0-.64-.64h-296.62a.64.64 0 0 1-.64-.64v-89.59c0-.36.29-.64.64-.64h387.51c.36 0 .64.29.64.64v383.82c0 .19.08.36.22.49l83.1 72.09c.27.24.3.65.06.92Zm-337.87-29.78 163.27-94.74c.2-.12.32-.33.32-.56V530.54c0-.5-.54-.8-.96-.56L2701.17 649.6c-15.15 9.09-23.23 22.22-23.23 39.39 0 25.24 22.22 45.45 45.45 45.45 9.09 0 16.15-2.02 23.23-6.07ZM3538.58 336.12c-32.96-32.95-72.9-49.93-119.84-49.93-55.69 0-100.48 21.79-134.38 65.37a.61.61 0 0 1-.91.08l-59.94-55.04a.63.63 0 0 0-.9.04l-59.07 65.96a.64.64 0 0 0 .05.9l85.2 77.28c.13.12.21.29.21.47V723.3c0 .35-.29.64-.64.64h-84.66a.64.64 0 0 0-.64.64v88.59c0 .35.29.64.64.64h305.1c.35 0 .64-.29.64-.64v-88.59a.64.64 0 0 0-.64-.64h-129.29a.64.64 0 0 1-.64-.64V460.25c0-41.97 30.45-79.89 72.23-83.83 47.34-4.47 87.54 33.06 87.54 79.52v29.32c0 .35.29.64.64.64h88.6c.35 0 .64-.29.64-.64v-29.32c0-46.93-16.98-86.88-49.93-119.83ZM1823.98 600.5c-6.22-14.51-15.66-27.21-26.99-36.45-10.58-10.57-24.11-18.85-42.32-25.91-18.6-8.75-35.87-13.85-48.84-17.31-16.85-4.49-35.01-9.21-55.39-13.09-39.83-7.96-69.35-17.88-87.71-29.47-17.93-11.33-27.02-26.26-27.02-44.41 0-21.06 7.64-35.8 24.2-46.53 23.29-15.09 52.03-19.17 79.01-13.62 26.1 5.37 49.63 20.56 69.41 37.92 4.02 3.53 45.13 41.31 44.37 42.17l59.09-66.95s-28.44-28.8-41.92-40.54c-32.14-27.98-70.36-51.61-113.41-58.4-42.77-6.75-91.43-.29-129.98 19.65a172.67 172.67 0 0 0-29.97 19.71c-34.32 28.08-51.71 64.95-51.71 109.61s14.69 79.88 44.84 101.71c28.29 21.22 68.98 37.67 120.97 48.89 45.94 9.77 79.31 19.77 99.4 29.8 19.12 8.19 28.41 21.3 28.41 40.07 0 24.19-9.75 42.5-29.07 54.46-43.51 26.94-103.96 25.74-147.95.48-18.97-10.9-34.68-26.71-51.3-40.74-12.75-10.88-24.81-22.56-37.09-33.97-.14-.13-.28-.26-.48-.52l-57.52 69.28c-.17.21 28.12 26.19 30.59 28.44 38.88 35.44 80.79 64.78 133.12 75.62a280.5 280.5 0 0 0 56.85 5.65c56.29 0 103.73-14.81 140.95-43.99 39.04-29.79 58.84-71.09 58.84-122.73 0-17.07-3.97-34.03-11.37-48.82Z"></path>
                            </g>
                        </svg>
                    </Horizontal>
                </Vertical>
                <p>To get started with your blog, you need the following:</p>
                <ul>
                    <li>
                        <Horizontal gap={8}>
                            <SquareImage size={32} src={isBeeRunning ? './assets/yes.png' : './assets/no.png'} />
                            Local Bee node
                        </Horizontal>
                    </li>
                    <li>
                        <Horizontal gap={8}>
                            <SquareImage size={32} src={hasPostageStamp ? './assets/yes.png' : './assets/no.png'} />
                            Usable postage stamp
                        </Horizontal>
                    </li>
                </ul>
                <Horizontal gap={8}>
                    <input id="agreement" type="checkbox" onChange={event => setAccepted(event.target.checked)} />I
                    understand that it is my responsibility to ensure that the postage stamp TTL does not run out. If
                    the stamp expires, I lose my blog.
                </Horizontal>
                <Horizontal gap={8}>
                    <input
                        className="etherjot-input"
                        type="text"
                        placeholder="Enter your blog's name"
                        onChange={event => setBlogName(event.target.value)}
                        disabled={!hasPostageStamp}
                    />
                    <Button onClick={onClick} disabled={!blogName || !accepted || loading}>
                        {loading ? 'Creating...' : 'Create'}
                    </Button>
                </Horizontal>
            </div>
        </>
    )
}
