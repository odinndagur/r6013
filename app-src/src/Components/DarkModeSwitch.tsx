import { useContext, useState } from 'react'
import { ThemeContext } from './ThemeContext'

//@ts-nocheck
export function DarkModeSwitch() {
    const {currentTheme, setCurrentTheme} = useContext(ThemeContext)
    console.log(currentTheme)
    // const [currentTheme, setCurrentTheme] = useState(
    //     window.localStorage.getItem('theme_mode') ?? 'light'
    // )

    const toggleDarkMode = () => {
        console.log(currentTheme)
        // console.log('darkmode')
        // const currentTheme = JSON.parse(
        //     window.localStorage.getItem('theme_mode') ?? 'light'
        // )
        // if (currentTheme === null) {}
        if (currentTheme === 'dark') {
            // document.documentElement.classList.add('dark-mode')
            window.setActiveStyleSheet('light')
            setCurrentTheme('light')
            localStorage.setItem('theme_mode', 'light')
        } else {
            // document.documentElement.classList.remove('dark-mode')
            window.setActiveStyleSheet('dark')
            setCurrentTheme('dark')
            localStorage.setItem('theme_mode', 'dark')
        }
        // console.log('just toggled darkmode')
        // setTimeout(() => {
        //     console.log(currentTheme)
        //     navigate({
        //         search: (old) => ({ ...old, dark: !currentTheme }),
        //         replace: true,
        //     })
        // }, 150)
    }

    return (
        <span
            role="button"
            className="material-icons dark-mode-switch"
            onClick={() => toggleDarkMode()}
            style={{ fontSize: '2.5rem' }}
        >
            {/* <span className="material-icons" style={{}}> */}
            {currentTheme === 'dark' ? 'light_mode' : 'dark_mode'}
            {/* </span> */}
        </span>
    )
}
