import { useMatch } from '@tanstack/react-location'
import { VideoListItem } from './VideoListItem'
import { useQuery } from '@tanstack/react-query'
import { getVideoById } from '../db'
import { Header } from './Header'
import { Footer } from './Footer'
import { YoutubePlayer } from './YoutubePlayer'

export function VideoPage() {
    const {
        data: { video },
    } = useMatch()

    // const { data: video, isLoading } = useQuery({
    //     queryFn: () => getVideoById(videoId),
    //     queryKey: ['video', videoId],
    // })
    // if (isLoading) {
    //     return
    // }
    return (
        <>
            <Header></Header>
            {
                video && (
                    <div>
                        <div style={{ textAlign: 'center' }}>
                            <h2>
                                {video.band} @ {video.venue}
                            </h2>
                            <p>
                                {new Date(video.date).toLocaleDateString('is', {
                                    dateStyle: 'medium',
                                })}
                            </p>
                        </div>
                        <YoutubePlayer videoId={video.url} />
                    </div>
                )
                // <VideoListItem video={video} key={video.video_id} />
            }
            <Footer />
        </>
    )
}
