import { Navigate, useMatch } from '@tanstack/react-location'

export function RandomVideo() {
    const {
        data: { videoId },
    } = useMatch()
    return (
        <Navigate
            to={`/videos/${videoId}`}
            replace
            search={(old) => ({ ...old })}
        />
    )
}
