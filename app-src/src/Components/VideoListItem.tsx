import { YoutubePlayer } from './YoutubePlayer'

export function VideoListItem({ video }) {
    return (
        <div>
            <h2>
                {video.band} @ {video.venue}
            </h2>
            <i>{video.date}</i>
            <ul>
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
            </ul>
            <YoutubePlayer videoId={video.url} />
        </div>
    )
}
