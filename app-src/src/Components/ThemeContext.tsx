import { createContext } from 'react'
export const ThemeContext = createContext(
    window.localStorage.getItem('theme_mode') ?? 'light'
)

// export { ThemeContext }
