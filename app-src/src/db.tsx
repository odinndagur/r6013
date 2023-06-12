const DB_CONSOLE_LOGS = true
const query = async (query: string) => {
    DB_CONSOLE_LOGS && console.log(query)
    const result = await window.promiseWorker.postMessage({
        type: 'sql',
        query: query,
    })
    return result
}

const exec = async (query: string) => {
    DB_CONSOLE_LOGS && console.log(query)

    window.promiseWorker.postMessage({ type: 'exec', query: query })
}

const exportDB = async () => {
    const exportedDB: Uint8Array = await window.promiseWorker.postMessage({
        type: 'export',
    })
    console.log(exportedDB)
    return exportedDB
}

const listDefaultCollections = async () => {
    const defaultCollections = await window.promiseWorker.postMessage({
        type: 'listCollections',
    })
    return defaultCollections
}

export const getVideoById = async (id: number) => {
    console.log('getting video by id: ' + id)
    const result = await query(`

        select distinct json_object(
            'band',band.name,
            'members', json_group_array(distinct json_object('name',person.name,'id',person.id)),
            'video_id',video.id,
            'show_id',video.show_id,
            'url',video.url,
            'band_id',video.band_id,
            'venue',venue.venue_name,
            'date',show.date

    ) AS video_json
    FROM video
    JOIN band ON video.band_id = band.id
    LEFT JOIN band_member ON band_member.band_id = band.id
    LEFT JOIN person ON band_member.member_id = person.id
    LEFT JOIN show ON video.show_id = show.id
    LEFT JOIN venue ON venue.id = show.venue_id
    WHERE video.id = ${id}
    `)
    DB_CONSOLE_LOGS && console.log(JSON.parse(result[0].video_json))
    // return result.map((res) => JSON.parse(res.video_json))
    return JSON.parse(result[0].video_json)
}

const searchBands = async ({ searchQuery }: { searchQuery: string }) => {
    const result = await query(`
        select * from band where name like "%${searchQuery}%"
    `)
    DB_CONSOLE_LOGS && console.log(result)
    return result
}

export const searchVideos = async ({
    searchQuery,
}: {
    searchQuery: string
}) => {
    const searchClause = searchQuery
        ? `
    WHERE band.name LIKE "%${searchQuery}%"
    OR venue_name LIKE "%${searchQuery}%"`
        : ''
    const result = await query(`

            select distinct json_object(
                'band',band.name,
                'members', json_group_array(distinct json_object('name',person.name,'id',person.id)),
                'video_id',video.id,
                'show_id',video.show_id,
                'url',video.url,
                'band_id',video.band_id,
                'venue',venue.venue_name,
                'date',show.date

        ) AS video_json
        FROM video
        JOIN band ON video.band_id = band.id
        LEFT JOIN band_member ON band_member.band_id = band.id
        LEFT JOIN person ON band_member.member_id = person.id
        LEFT JOIN show ON video.show_id = show.id
        LEFT JOIN venue ON venue.id = show.venue_id
        ${searchClause}
        GROUP BY video.id
    `)
    DB_CONSOLE_LOGS && console.log(JSON.parse(result[0].video_json))
    return result.map((res) => JSON.parse(res.video_json))
    JSON.parse(result[0].video_json)
}

export const getRandomVideo = async () => {
    // const res = await query('select count(*) as sign_count from sign')
    // // DB_CONSOLE_LOGS && console.log(res)
    // const count = parseInt(res[0].sign_count)
    // // DB_CONSOLE_LOGS && console.log(count)
    // const index = Math.floor(Math.random() * count)
    // // DB_CONSOLE_LOGS && console.log(index)
    // const signs = await query(`select * from sign limit 1 offset ${index}`)
    const videos = await query(`select * from video order by random() limit 1`)
    DB_CONSOLE_LOGS && console.log(videos[0])
    return videos[0].id
}

export { query, exportDB, listDefaultCollections, searchBands }
