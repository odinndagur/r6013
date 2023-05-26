import { useSearch, MakeGenerics } from '@tanstack/react-location'

type HandformGenerics = MakeGenerics<{
    Search: {
        handform?: string
    }
}>

export function Handform() {
    const search = useSearch<HandformGenerics>()
    return (
        <div className="placeholder-image-container">
            <p>{search.handform}</p>
            <img
                className="placeholder-image"
                src={`/itm-dev/assets/itm-images/handform/${decodeURIComponent(
                    search.handform!
                )}.png`}
            />
        </div>
    )
}
