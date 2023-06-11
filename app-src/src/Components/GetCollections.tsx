import { useQuery } from '@tanstack/react-query'
import { listDefaultCollections } from '../db'

export function GetCollections() {
    const { data: defaultCollections } = useQuery({
        queryFn: () => listDefaultCollections(),
        queryKey: ['default-collections'],
    })

    return (
        <div>
            {defaultCollections.map((collection) => {
                return (
                    <div>
                        <h1>{collection.name}</h1>
                        <ul>
                            {collection.signs.map((sign) => {
                                return <li>{sign}</li>
                            })}
                        </ul>
                    </div>
                )
            })}
        </div>
    )
}
