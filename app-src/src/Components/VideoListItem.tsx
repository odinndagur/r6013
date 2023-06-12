import { useEffect, useState } from 'react'
import { YoutubePlayer } from './YoutubePlayer'

export function VideoListItem({ video }) {
    const [dateString, setDateString] = useState('')
    useEffect(() => {
        const date = new Date(video.date)
        // console.log(video.date, date)
        setDateString(date.toLocaleDateString('is', { dateStyle: 'medium' }))
    }, [])
    return (
        <div
            style={{
                padding: '2rem',
                margin: '1rem',
                boxShadow: 'var(--card-box-shadow)',
            }}
        >
            <h2>
                {video.band} @ {video.venue}
            </h2>
            <i>{dateString}</i>
            {/* <ul>
                <li>
                    <h3>Meðlimir</h3>
                    <ul>
                        {video.members.map((member) => {
                            return <li key={member.id}>{member.name}</li>
                        })}
                    </ul>
                </li>
                <li>
                    <h3>Youtube</h3>
                    {video.url}
                </li>
                <li>
                    <h3>Venue</h3>
                    {video.venue}
                </li>
                <li>
                    <h3>Date</h3>
                    {video.date}
                </li>
            </ul> */}
            <YoutubePlayer videoId={video.url} />
        </div>
    )
}
