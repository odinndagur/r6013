import { useEffect, useState } from 'react'
import { Header } from './Header'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { searchBands, searchVideos } from '../db'
import { useNavigate, useSearch } from '@tanstack/react-location'
import { YoutubePlayer } from './YoutubePlayer'
import { VideoListItem } from './VideoListItem'
import { Footer } from './Footer'

export function VideoListPage() {
    const navigate = useNavigate()
    const searchParams = useSearch()
    const [searchValue, setSearchValue] = useState('')
    useEffect(() => {
        setTimeout(() => {
            setSearchValue(searchParams.query ?? '')
        }, 50)
    }, [])
    const handleSearch = (searchValue: string) => {
        setSearchValue(searchValue)
        navigate({
            search: (old) => ({ ...old, query: searchValue }),
            replace: true,
        })
    }

    const { data: videos, isLoading } = useQuery({
        queryFn: () => searchVideos({ searchQuery: searchValue }),
        queryKey: ['videos', searchValue],
    })
    // if (isLoading) {
    //     return
    // }
    return (
        <>
            <Header>
                <div
                    className="search"
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '1rem',
                    }}
                >
                    <input
                        onChange={(event) => handleSearch(event.target.value)}
                        type="search"
                        placeholder="Leita að myndbandi"
                        value={searchValue}
                        // style={{ height: '100%' }}
                        // ref={inputRef}
                    />
                </div>
            </Header>
            {videos &&
                videos.map((video) => {
                    return <VideoListItem key={video.video_id} video={video} />
                })}
            <Footer />
        </>
    )
}
