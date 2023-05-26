import { Navigate, useMatch } from '@tanstack/react-location'

export function RandomSign() {
    const {
        data: { sign },
    } = useMatch()
    return (
        <Navigate
            to={`/signs/${sign.id}`}
            replace
            search={(old) => ({ ...old })}
        />
    )
}
