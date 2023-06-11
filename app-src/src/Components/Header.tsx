import { Link } from '@tanstack/react-location'
import { AppNavBar } from './AppNavBar'
import { useEffect, useState } from 'react'
import { DarkModeSwitch } from './DarkModeSwitch'

export function Header({ children }: { children?: any }) {
    const [standalone, setStandalone] = useState(false)
    useEffect(() => {
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setStandalone(true)
        }
    })

    return (
        <header
            style={{
                backgroundColor: 'var(--background-color)',
                position: standalone ? 'sticky' : undefined,
                top: '0',
                padding: '2rem 1rem',
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div
                    className="dark-mode-switch-container"
                    style={{
                        position: 'static',
                        top: 'env(safe-area-inset-top)',
                        left: '0',
                        padding: 0,
                        zIndex: 9999,
                        // display:standalone? 'none' : 'flex',
                        display: 'flex',
                        flexDirection: 'column',
                        visibility: !standalone ? undefined : 'hidden',
                        alignItems: 'center',
                        cursor: 'pointer',
                    }}
                    onClick={() => {
                        const el = document.getElementById(
                            'app-save-modal'
                        ) as HTMLDialogElement
                        el.showModal()
                    }}
                >
                    <span className="material-icons">install_mobile</span>
                    <span>Vista app</span>
                </div>
                <div
                    className="dark-mode-switch-container"
                    style={{
                        position: 'static',
                        top: 'env(safe-area-inset-top)',
                        right: '0',
                        padding: 0,
                        zIndex: 9999,
                    }}
                >
                    <DarkModeSwitch />
                </div>
            </div>
            <div
                style={{
                    display: 'flex',
                    flexBasis: '100%',
                    justifyContent: 'space-evenly',
                    alignItems: 'center',
                    maxHeight: '2rem',
                }}
            >
                <Link
                    style={{ paddingBottom: '0.5rem' }}
                    to={'/'}
                    search={(old) => ({ ...old, scroll: 0 })}
                    className="heading"
                >
                    R6013
                </Link>
            </div>
            <AppNavBar type="header" />
            {children}
        </header>
    )
}
