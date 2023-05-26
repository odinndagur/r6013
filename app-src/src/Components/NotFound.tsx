import { usePrompt } from '@tanstack/react-location'
import { Header } from './Header'

export function NotFound() {
    return (
        <Header>
            `This would render as the fallback when '/' or '/about' were not
            matched`
        </Header>
    )
}
