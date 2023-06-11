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

const createCollectionFromJson = async (jsonCollection: {
    name: string
    signs: string[]
}) => {
    exec(
        `INSERT INTO collection(name,user_id) VALUES("${jsonCollection.name}",3)`
    )
    jsonCollection.signs.forEach((sign) => {
        exec(`INSERT INTO sign_collection(sign_id,collection_id)
                SELECT sign.id,collection.id
                FROM sign
                LEFT JOIN collection
                WHERE sign.phrase = "${sign}"
                AND collection.name = "${jsonCollection.name}"
                `)
    })
    const res = await query(`SELECT * FROM sign
                            JOIN sign_collection ON sign.id = sign_collection.sign_id
                            JOIN collection ON sign_collection.collection_id = collection.id
                            WHERE collection.name = "${jsonCollection.name}"
                            `)
    console.log(res)
}

//@ts-ignore
const addSignToCollection = async ({ signId, collectionId }) => {
    exec(
        `insert into sign_collection(sign_id, collection_id) values(${signId},${collectionId})`
    )
    getSignByIdJson(signId).then((sign) => {
        console.log({ sign })
        sign.videos.map((video) => {
            try {
                fetch(`https://i.ytimg.com/vi/${video}/maxresdefault.jpg`, {
                    mode: 'no-cors',
                })
                fetch(`https://i.ytimg.com/vi/${video}/hqdefault.jpg`, {
                    mode: 'no-cors',
                })
            } catch (error) {}
        })
    })
    const checkSuccess = await query(
        `select * from sign_collection where sign_id = ${signId} and collection_id = ${collectionId}`
    )
    if (checkSuccess.length) {
        return { status: 'OK' }
    }
    return { status: 'ERROR' }
}

//@ts-ignore
const deleteSignFromCollection = async ({ signId, collectionId }) => {
    exec(`delete from sign_collection
    where sign_id = ${signId}
    and collection_id = ${collectionId}`)
}

const createCollection = async ({
    userId,
    collectionName,
}: {
    userId: string | number
    collectionName: string
}) => {
    exec(`
    INSERT INTO collection(name,user_id)
    VALUES ("${collectionName}",${userId})
    `)
}

const deleteCollection = async ({ collectionId }: { collectionId: number }) => {
    exec(`
    DELETE FROM collection WHERE collection.id = ${collectionId}
    `)
    exec(`
    DELETE FROM sign_collection WHERE collection_id = ${collectionId}
    `)
}

// left join collection
// on collection.id = ${collectionId}
// left join collection as multiCollection
// on multiCollection.id = sign_collection.collection_id


const getSignByIdJson = async (id: number) => {
    console.log('getting sign by id with json: ' + id)
    const stmt = `
        SELECT
        json_object(
            'id',sign.id,
            'phrase',sign.phrase,
            'videos', json_group_array(distinct json_object('rank',sign_video.rank,'video_id', sign_video.video_id)),
            'efnisflokkar', json_group_array(distinct efnisflokkur.text),
            'related_signs', json_group_array(distinct json_object('phrase',related.phrase,'id', related.id)),
            'collections', json_group_array(distinct json_object('name',collection.name,'id',collection.id)),
            'myndunarstadur',sign.myndunarstadur,
            'ordflokkur',sign.ordflokkur,
            'islenska',sign.islenska,
            'taknmal',sign.taknmal,
            'description',sign.description,
            'munnhreyfing', sign.munnhreyfing,
            'handform', sign.handform
        ) as sign_json
        FROM sign
        LEFT JOIN sign_video
        ON sign.id = sign_video.sign_id
        LEFT JOIN sign_efnisflokkur
        ON sign_efnisflokkur.sign_id = sign.id
        LEFT JOIN efnisflokkur
        ON sign_efnisflokkur.efnisflokkur_id = efnisflokkur.id
        LEFT JOIN sign_related
        ON sign_related.sign_id = sign.id
        LEFT JOIN
            (SELECT * FROM sign WHERE sign.id IN
                (SELECT sign_id from sign_related where related_id = ${id}
                UNION
                SELECT related_id from sign_related where sign_id = ${id}
                )
            ) as related
        LEFT JOIN sign_collection ON sign.id = sign_collection.sign_id
        LEFT JOIN collection ON sign_collection.collection_id = collection.id
        WHERE sign.id = ${id}
        GROUP BY sign.id
    `
    const signs = await query(stmt)
    // DB_CONSOLE_LOGS && console.log(signs)
    // DB_CONSOLE_LOGS && console.log(signs[0])
    // DB_CONSOLE_LOGS && console.log(signs[0].sign_json)
    // DB_CONSOLE_LOGS && console.log(JSON.parse(signs[0].sign_json))
    let sign: {
        id: string
        phrase: string
        videos: { rank: number; video_id: string }[]
        efnisflokkar: string[]
        related_signs: { phrase: string; id: number }[]
        myndunarstadur: string
        ordflokkur: string
    } = JSON.parse(signs[0].sign_json)
    sign.videos = sign.videos
        .sort((a: any, b: any) => {
            return a.rank - b.rank
        })
        .map((video: any) => {
            return video.video_id
        })
    DB_CONSOLE_LOGS && console.log(sign)
    return sign
}

const getUserById = async (id: number) => {
    console.log(`Getting user by id: ${id}`)
    const stmt = `
        SELECT
        json_object(
            'id',user.id,
            'name',user.name,
            'collections', json_group_array(distinct json_object('id',collection.id,'name', collection.name, 'user_id', collection.user_id, 'created_at', collection.created_at))
        ) as user_json
        FROM user
        LEFT JOIN collection
        ON collection.id = 1
        OR user.id = collection.user_id
        WHERE user.id = ${id}
        GROUP BY user.id
    `
    const users = await query(stmt)
    let user: {
        id: number
        name: string
        collections: { id: number; name: string }[]
    } = JSON.parse(users[0].user_json)
    DB_CONSOLE_LOGS && console.log(user)
    return user
}

const getSignById = async (id: number) => {
    console.log('getting sign by id: ' + id)
    const stmt = `
        SELECT sign.*,
        GROUP_CONCAT(distinct sign_video.rank || ':' || sign_video.video_id) as youtube_ids,
        GROUP_CONCAT(distinct efnisflokkur.text) as efnisflokkar,
        GROUP_CONCAT(distinct related.phrase || ':' || related.id) as related_signs,
        sign.myndunarstadur,
        sign.ordflokkur
        FROM sign
        JOIN sign_video
        ON sign.id = sign_video.sign_id
        JOIN sign_efnisflokkur
        ON sign_efnisflokkur.sign_id = sign.id
        JOIN efnisflokkur
        ON sign_efnisflokkur.efnisflokkur_id = efnisflokkur.id
        JOIN sign_related
        ON sign_related.sign_id = sign.id
        JOIN sign AS related
        ON sign_related.related_id = related.id

        
        WHERE sign.id = ${id}
        GROUP BY sign.id
    `
    const signs = await query(stmt)
    let sign = signs[0]
    sign['youtube_ids'] = sign['youtube_ids']
        .split(',')
        .sort((a: any, b: any) => {
            let rank1 = a.split(':')[0]
            let rank2 = b.split(':')[0]
            return rank1 - rank2
        })
        .map((video: any) => {
            return video.split(':')[1]
        })

    sign['related_signs'] = sign['related_signs']
        .split(',')
        .map((sign: any) => {
            const [phrase, id] = sign.split(':')
            return { id, phrase }
        })

    sign['efnisflokkar'] = sign['efnisflokkar'].split(',')

    // console.log('getsignbyid')
    // console.log(sign)
    return signs[0]
}

const getSignByPhrase = async (phrase: string) => {
    console.log('getting sign by phrase with json: ' + phrase)
    const stmt = `
        SELECT
        json_object(
            'id',sign.id,
            'phrase',sign.phrase,
            'videos', json_group_array(distinct json_object('rank',sign_video.rank,'video_id', sign_video.video_id)),
            'efnisflokkar', json_group_array(distinct efnisflokkur.text),
            'related_signs', json_group_array(distinct json_object('phrase',related.phrase,'id', related.id)),
            'myndunarstadur',sign.myndunarstadur,
            'ordflokkur',sign.ordflokkur,
            'islenska',sign.islenska,
            'taknmal',sign.taknmal,
            'description',sign.description,
            'handform',sign.handform
        ) as sign_json
        FROM sign
        LEFT JOIN sign_video
        ON sign.id = sign_video.sign_id
        LEFT JOIN sign_efnisflokkur
        ON sign_efnisflokkur.sign_id = sign.id
        LEFT JOIN efnisflokkur
        ON sign_efnisflokkur.efnisflokkur_id = efnisflokkur.id
        LEFT JOIN sign_related
        ON sign_related.sign_id = sign.id
        LEFT JOIN
            (SELECT * FROM sign WHERE sign.id IN
                (SELECT sign_id from sign_related where related_id = sign.id
                UNION
                SELECT related_id from sign_related where sign_id = sign.id
                )
            ) as related
            WHERE sign.phrase LIKE "${String(phrase).toLowerCase().trim()}"
            GROUP BY sign.id
    `
    const signs = await query(stmt)
    // console.log(signs)
    // console.log(signs[0])
    // console.log(signs[0].sign_json)
    // console.log(JSON.parse(signs[0].sign_json))
    let sign: {
        id: string
        phrase: string
        videos: { rank: number; video_id: string }[]
        efnisflokkar: string[]
        related_signs: { phrase: string; id: number }[]
        myndunarstadur: string
        ordflokkur: string
    } = JSON.parse(signs[0].sign_json)
    sign.videos = sign.videos
        .sort((a: any, b: any) => {
            return a.rank - b.rank
        })
        .map((video: any) => {
            return video.video_id
        })
    // console.log(sign)
    return sign
}

const searchSigns = async (searchValue: string, collectionId: number = 3) => {
    let stmt = ''
    // const collectionId = message.collectionId ?? 3
    console.log('searchsigns')
    if (!searchValue) {
        stmt = `select distinct sign.id as sign_id,
            sign.phrase as phrase,
            sign_video.video_id as youtube_id,
            sign_fts.related_signs as related_signs,
            CASE WHEN sign_collection.collection_id = ${collectionId} THEN true ELSE false END as is_in_collection
            from sign
            join sign_fts
            on sign.id = sign_fts.id
            LEFT JOIN sign_collection
            ON sign_collection.sign_id = sign.id
            LEFT JOIN sign_video
            ON sign.id = sign_video.sign_id
            group by sign.id
            order by phrase asc`
    }
    if (searchValue[0] === '*') {
        stmt = `select distinct sign.id as sign_id,
            sign.phrase as phrase,
            sign_video.video_id as youtube_id,
            sign_fts.related_signs as related_signs,
            CASE WHEN sign_collection.collection_id = ${collectionId} THEN true ELSE false END as is_in_collection
            from sign
            join sign_fts
            on sign.id = sign_fts.id
            LEFT JOIN sign_collection
            ON sign_collection.sign_id = sign.id
            LEFT JOIN sign_video
            ON sign.id = sign_video.sign_id
            where sign.phrase like "%${searchValue.substring(1)}%"
            group by sign.id
            order by sign.phrase asc`
    }
    if (searchValue && searchValue[0] != '*') {
        if (searchValue[searchValue.length - 1] != '*') {
            searchValue = searchValue + '*'
        }
        stmt = `select distinct sign.id as sign_id,
            sign.phrase as phrase,
            sign_video.video_id as youtube_id,
            sign_fts.related_signs as related_signs,
            CASE WHEN sign_collection.collection_id = ${collectionId} THEN true ELSE false END as is_in_collection
            from sign_fts
            join sign on sign.id = sign_fts.id
            LEFT JOIN sign_collection
            ON sign_collection.sign_id = sign.id
            LEFT JOIN sign_video
            ON sign.id = sign_video.sign_id
            where sign_fts match "${searchValue}"
            group by sign.id
            order by sign_fts.rank, sign.phrase asc`
    }
    const result = await query(stmt)
    return result
}

const signSearchWithCollectionId = async (
    searchValue: string,
    collectionId: number,
    limit: number = 500,
    offset: number = 0,
    userCollection: number = 3
) => {
    let stmt = `
        select distinct
        sign.id as sign_id,
        sign.phrase as phrase,
        sign_video.video_id as youtube_id,
        sign_fts.related_signs as related_signs,
            case when sign_collection.collection_id = ${userCollection} then true else false end as in_collection
        from sign
        join sign_fts
        on sign.id = sign_fts.id
        left join sign_collection
        on sign.id = sign_collection.sign_id
        and sign_collection.collection_id = ${collectionId}
        LEFT JOIN sign_video
        ON sign.id = sign_video.sign_id
        order by sign.phrase asc
        limit ${limit}
        offset ${offset}`
    const result = await query(stmt)
    return result
}

const getCollectionById = async (
    searchValue: string,
    collectionId: number,
    limit: number = 20000,
    offset: number = 0,
    userCollection: number = 3
) => {
    let stmt = ''
    if (!searchValue) {
        stmt = `select distinct sign.id as sign_id,
            sign.phrase as phrase,
            sign_video.video_id as youtube_id,
            sign_fts.related_signs as related_signs,
            json_group_array(
                distinct json_object('collection_name',collection.name,'collection_id',collection.id)
                )
            from sign
            join sign_fts
            on sign.id = sign_fts.id
            left join sign_collection
            on sign.id = sign_collection.sign_id
            left join collection
            on collection.id = sign_collection.collection_id
            LEFT JOIN sign_video
            ON sign.id = sign_video.sign_id
            group by sign.id
            order by sign.phrase asc
            limit ${limit}
            offset ${offset}`
    }
    if (searchValue[0] === '*') {
        stmt = `select distinct sign.id as sign_id,
            sign.phrase as phrase,
            sign_video.video_id as youtube_id,
            sign_fts.related_signs as related_signs,
            collection.id as collection_id,
            collection.name as collection_name,
                case when sign_collection.collection_id = ${userCollection} then true else false end as in_collection
            from sign
            join sign_fts
            on sign.id = sign_fts.id
            left join sign_collection
            on sign.id = sign_collection.sign_id
            left join collection
            on collection.id = sign_collection.collection_id
            LEFT JOIN sign_video
            ON sign.id = sign_video.sign_id
            where sign.phrase like "%${searchValue.substring(1)}%"
            and collection.id = ${collectionId}
            group by sign.id
            order by sign.phrase asc
            limit ${limit}
            offset ${offset}`
    }
    if (searchValue && searchValue[0] != '*') {
        if (searchValue[searchValue.length - 1] != '*') {
            searchValue = searchValue + '*'
        }
        stmt = `select distinct sign.id as sign_id,
            sign.phrase as phrase,
            sign_video.video_id as youtube_id,
            sign_fts.related_signs as related_signs,
            collection.id as collection_id,
            collection.name as collection_name,
                case when sign_collection.collection_id = ${userCollection} then true else false end as in_collection
            from sign_fts
            join sign on sign.id = sign_fts.id
            left join sign_collection
            on sign.id = sign_collection.sign_id
            left join collection
            on collection.id = sign_collection.collection_id
            LEFT JOIN sign_video
            ON sign.id = sign_video.sign_id
            where sign_fts match "${searchValue}"
            and collection.id = ${collectionId}
            group by sign.id
            order by sign_fts.rank, sign.phrase asc
            limit ${limit}
            offset ${offset}`
    }
    const result: {
        sign_id: number
        phrase: string
        youtube_id: string
        related_signs: string
        collection_id: number
        collection_name: string
        in_collection: boolean
    }[] = await query(stmt)
    return result
}

const checkSignInCollection = async ({
    sign_id,
    collection_id,
}: {
    sign_id: number
    collection_id: number
}) => {
    let res = await query(`
        select case when exists
            (select *
            from sign_collection
            where sign_id = ${sign_id}
            and collection_id = ${collection_id}
            )
            then true
            else false
            end
            as in_collection;
        `)
    // console.log(res)
    return res[0].in_collection
}

const searchPagedCollectionById = async ({
    searchValue,
    collectionId,
    page,
}: {
    searchValue: string
    collectionId: number | string
    page: number | string
}) => {
    const limit = 100
    const offset = (Number(page) - 1) * limit
    let stmt = ''
    let totalSignCount = 0
    let totalPages = 0
    if (!searchValue) {
        // const tempCount = await query(`
        //     select count(*) as sign_count from sign
        //     join sign_fts
        //     on sign.id = sign_fts.id
        //     left join sign_collection on sign.id = sign_collection.sign_id
        //     left join collection
        //     on collection.id = sign_collection.collection_id
        //     where collection.id = ${collectionId}
        // `)
        // totalSignCount = tempCount[0].sign_count
        // totalPages = Math.ceil(totalSignCount / limit)
        // console.log({ offset, tempCount, totalSignCount, totalPages })
        const orderBy =
            collectionId == 1 ? 'sign.phrase asc' : 'sign_collection.date_added'
        stmt = `select distinct sign.id as sign_id,
            sign.phrase as phrase,
            sign_video.video_id as youtube_id,
            sign_fts.related_signs as related_signs,
            collection.name as collection_name,
            group_concat(multiCollection.id) as collections,
            count(*) over() as sign_count
            from sign
            join sign_fts
            on sign.id = sign_fts.id
            left join sign_collection
            on sign.id = sign_collection.sign_id
            left join collection
            on collection.id = sign_collection.collection_id
            left join collection as multiCollection
            on multiCollection.id = sign_collection.collection_id
            LEFT JOIN sign_video
            ON sign.id = sign_video.sign_id
            where collection.id = ${collectionId}
            group by sign.id
            order by ${orderBy}
            limit ${limit}
            offset ${offset}`
    }
    if (searchValue[0] === '*') {
        // const tempCount = await query(`select count(*) as sign_count
        // from sign
        // join sign_fts
        // on sign.id = sign_fts.id
        // left join sign_collection on sign.id = sign_collection.sign_id
        // left join collection
        // on collection.id = sign_collection.collection_id
        // where sign.phrase like "%${searchValue.substring(1)}%"
        // and collection.id = ${collectionId}
        // `)
        // totalSignCount = tempCount[0].sign_count
        const orderBy =
            collectionId == 1
                ? `levenshtein(sign.phrase,${searchValue.substring(1)}) asc`
                : 'sign_collection.date_added'
        stmt = `select distinct sign.id as sign_id,
            sign.phrase as phrase,
            sign_video.video_id as youtube_id,
            sign_fts.related_signs as related_signs,
            collection.name as collection_name,
            group_concat(collection.id) as collections,
            count(*) over() as sign_count
            from sign
            join sign_fts
            on sign.id = sign_fts.id
            left join sign_collection
            on sign.id = sign_collection.sign_id
            left join collection
            on collection.id = sign_collection.collection_id
            left join collection as multiCollection
            on multiCollection.id = sign_collection.collection_id
            LEFT JOIN sign_video
            ON sign.id = sign_video.sign_id
            where sign.phrase like "%${searchValue.substring(1)}%"
            and collection.id = ${collectionId}
            group by sign_collection.sign_id
            order by ${orderBy}
            limit ${limit}
            offset ${offset}`
    }
    if (searchValue && searchValue[0] != '*') {
        let starredSearchValue
        if (searchValue[searchValue.length - 1] != '*') {
            starredSearchValue = searchValue + '*'
        }
        // const tempCount = await query(`
        // select count(*) as sign_count from sign_fts
        // join sign on sign.id = sign_fts.id
        // left join sign_collection on sign.id = sign_collection.sign_id
        // left join collection
        // on collection.id = sign_collection.collection_id
        // where sign_fts match "${starredSearchValue}"
        // and collection.id = ${collectionId}
        // `)
        // totalSignCount = tempCount[0].sign_count
        // totalPages = Math.ceil(totalSignCount / limit)
        // console.log({ offset, tempCount, totalSignCount, totalPages })
        const orderBy =
            collectionId == 1
                ? `levenshtein(sign.phrase,"${searchValue.substring(1)}") asc`
                : 'sign_collection.date_added'
        stmt = `select distinct sign.id as sign_id,
            sign.phrase as phrase,
            sign_video.video_id as youtube_id,
            sign_fts.related_signs as related_signs,
            collection.name as collection_name,
            group_concat(collection.id) as collections,
            count(*) over() as sign_count
            from sign_fts
            join sign on sign.id = sign_fts.id
            left join sign_collection
            on sign.id = sign_collection.sign_id
            left join collection
            on collection.id = sign_collection.collection_id
            left join collection as multiCollection
            on multiCollection.id = sign_collection.collection_id
            LEFT JOIN sign_video
            ON sign.id = sign_video.sign_id
            where sign_fts match "${starredSearchValue}"
            and collection.id = ${collectionId}
            group by sign_collection.sign_id
            order by ${orderBy}
            limit ${limit}
            offset ${offset}`
    }
    DB_CONSOLE_LOGS && console.log(stmt)
    let result: {
        id: number
        phrase: string
        youtube_id: string
        related_signs: string
        collections: string
        collection_id?: number
        collection_name?: string
        in_collection?: boolean
    }[] = await query(stmt)
    totalSignCount = result[0].sign_count
    totalPages = Math.ceil(totalSignCount / limit)
    console.log({ offset, tempCount, totalSignCount, totalPages })
    DB_CONSOLE_LOGS && console.log(result)
    const collection_name = result[0]?.collection_name
    return {
        signs: result,
        totalPages,
        totalSignCount,
        offset,
        limit,
        collection_name,
    }
}

const searchPagedCollectionByIdRefactor = async ({
    searchValue,
    collectionId,
    page,
    orderBy = { value: 'az', order: 'asc' },
    handform,
    myndunarstadur,
    ordflokkur,
    efnisflokkur,
}: {
    searchValue: string
    collectionId: number | string
    page: number | string
    orderBy: {
        value: string
        order: string
    }
    handform?: string[]
    myndunarstadur?: string[]
    ordflokkur?: string[]
    efnisflokkur?: string[]
}) => {
    const limit = 100
    const offset = (Number(page) - 1) * limit
    let stmt = ''
    let totalSignCount = 0
    let totalPages = 0
    const signDetails = {
        'sign.handform': handform?.length ? handform : [],
        myndunarstadur: myndunarstadur?.length ? myndunarstadur : [],
        'sign.ordflokkur': ordflokkur?.length ? ordflokkur : [],
        efnisflokkur: efnisflokkur?.length ? efnisflokkur : [],
    }

    const useSignDetails =
        signDetails &&
        Object.keys(signDetails).some((key) => {
            return (
                signDetails[key] != null &&
                signDetails[key] != undefined &&
                signDetails[key] != ''
            )
        })

    let signDetailsClause = ''
    if (useSignDetails && signDetails) {
        Object.keys(signDetails).forEach((key, idx) => {
            if (signDetails[key] != '') {
                signDetailsClause += ' AND '
                signDetailsClause += `${key} in ("${signDetails[key].join(
                    '", "'
                )}")`
            }
        })
        signDetailsClause += '\n'
        console.log(signDetailsClause)
    }

    console.log(orderBy)

    if (searchValue[0] == '*') {
        searchValue = searchValue.substring(1)
    } else if (searchValue[searchValue.length - 1] == '*') {
        searchValue = searchValue.substring(0, searchValue.length - 1)
    }


    const selectClauseJSON = `
        SELECT 
            distinct json_object(
                'id',sign.id,
                'phrase',sign.phrase,
                'videos', json_group_array(distinct json_object('rank',sign_video.rank,'video_id', sign_video.video_id)),
                'efnisflokkur', json_group_array(distinct efnisflokkur.text),
                --'related_signs', json_group_array(distinct json_object('phrase',related.phrase,'id', related.id)),
                --'related_signs', json_group_array(related.phrase),
                'related_signs', group_concat(related.phrase),
                'myndunarstadur',sign.myndunarstadur,
                'ordflokkur',sign.ordflokkur,
                'islenska',sign.islenska,
                'taknmal',sign.taknmal,
                'description',sign.description,
                'munnhreyfing', sign.munnhreyfing,
                'handform', sign.handform,
                'collections', json_group_array(multiCollection.id),
                'sign_count', count(*) over()
            ) as sign
        `

    const selectClause = `
        select distinct sign.id as sign_id,
        sign.phrase as phrase,
        sign_video.video_id as youtube_id,
        sign_fts.related_signs as related_signs,
        collection.name as collection_name,
        group_concat(distinct multiCollection.id) as collections,
        sign_collection.date_added as date_added,
        sign.myndunarstadur as myndunarstadur,
        sign.ordflokkur as ordflokkur,
        sign.handform as handform,
        efnisflokkur.text as efnisflokkur,
        count(*) over() as sign_count
        `

    const fromClause = `
        from sign
        join sign_fts
        on sign.id = sign_fts.id
        left join sign_collection
        on sign.id = sign_collection.sign_id
        left join collection
        on collection.id = sign_collection.collection_id
        left join collection as multiCollection
        on multiCollection.id = sign_collection.collection_id
        LEFT JOIN sign_video
        ON sign.id = sign_video.sign_id
        LEFT JOIN sign_efnisflokkur
        ON sign.id = sign_efnisflokkur.sign_id
        LEFT JOIN efnisflokkur
        ON efnisflokkur.id = sign_efnisflokkur.efnisflokkur_id
        --LEFT JOIN sign_related ON sign_related.sign_id = sign.id
        --LEFT JOIN sign as related ON related.id = sign_related.related_id
        `

    if (!searchValue) {
        // const tempCount = await query(`
        //     select count(*) as sign_count, efnisflokkur.text as efnisflokkur from sign
        //     join sign_fts
        //     on sign.id = sign_fts.id
        //     left join sign_collection on sign.id = sign_collection.sign_id
        //     left join collection
        //     on collection.id = sign_collection.collection_id
        //     LEFT JOIN sign_efnisflokkur
        //     ON sign.id = sign_efnisflokkur.sign_id
        //     LEFT JOIN efnisflokkur
        //     ON efnisflokkur.id = sign_efnisflokkur.efnisflokkur_id
        //     where collection.id = ${collectionId}
        //     ${useSignDetails ? signDetailsClause : ''}
        // `)
        // totalSignCount = tempCount[0].sign_count
        // totalPages = Math.ceil(totalSignCount / limit)
        // console.log({ offset, tempCount, totalSignCount, totalPages })
        // const orderBy =
        //     collectionId == 1 ? 'sign.phrase asc' : 'sign_collection.date_added'
        const orderByClause = `${
            orderBy.value == 'az' ? 'sign.phrase' : 'date_added'
            // orderBy.value == 'az' ? 'localizedOrder(sign.phrase)' : 'date_added'
        } ${orderBy.order}`
        stmt = `
            ${selectClause}
            ${fromClause}
            where collection.id = ${collectionId}
            ${useSignDetails ? signDetailsClause : ''}
            group by sign.id
            order by ${orderByClause}
            limit ${limit}
            offset ${offset}`
    } else {
        // const orderByClause =
        //     collectionId == 1
        //         ? `levenshtein(sign.phrase,"${searchValue}") asc`
        //         : 'date_added'
        const orderByClause = `${
            orderBy.value == 'az'
                ? 'levenshtein(sign.phrase,"' + searchValue + '")'
                : 'date_added'
        } ${orderBy.order}`

        const likeWhereClause = `
        WHERE sign.phrase LIKE "%${searchValue}%"
        AND collection.id = ${collectionId}
        ${signDetails ? signDetailsClause : ''}
        `
        const ftsWhereClause = `
        WHERE sign_fts MATCH "${searchValue}*"
        AND collection.id = ${collectionId}
        ${signDetails ? signDetailsClause : ''}
        `
        // const tempCount = await query(`
        //     select count(*) as sign_count from (
        //         ${selectClause}
        //         ${fromClause}
        //         ${likeWhereClause}
        //         GROUP BY sign_collection.sign_id
        //         UNION
        //         ${selectClause}
        //         ${fromClause}
        //         ${ftsWhereClause}
        //         GROUP BY sign_collection.sign_id
        //         ) as sign
        // `)
        // totalSignCount = tempCount[0].sign_count
        // totalPages = Math.ceil(totalSignCount / limit)
        // console.log({ offset, tempCount, totalSignCount, totalPages })
        stmt = `
        select *,count(sign.sign_id) over() as sign_count, levenshtein(sign.phrase,"${searchValue}") as levenshtein, sign.phrase as levenshtein_sign_phrase, "${searchValue}" as levenshtein_search_value from (
            ${selectClause}
            ${fromClause}
            ${likeWhereClause}
            GROUP BY sign_collection.sign_id
            UNION
            ${selectClause}
            ${fromClause}
            ${ftsWhereClause}
            GROUP BY sign_collection.sign_id
            ) as sign
            GROUP BY sign.sign_id
            ORDER BY ${orderByClause}
            LIMIT ${limit}
            OFFSET ${offset}
        `
    }


    DB_CONSOLE_LOGS && console.log(stmt)
    let result: {
        sign_id: number
        phrase: string
        youtube_id: string
        related_signs: string
        collections: string
        collection_id?: number
        collection_name?: string
        in_collection?: boolean
        sign_count?: number
    }[] = await query(stmt)
    result = result.map(res => {
        return {...res,collections: res.collections.split(',').map(collection => Number(collection))}
    })
    // result = result.map(res => {
    //     console.log(JSON.parse(res.sign))
    //     const currentSign = JSON.parse(JSON.parse(res.sign))
    //     return currentSign
    //     return Object.fromEntries(Object.keys(currentSign).map(key => [key, JSON.parse(currentSign[key])]))
    //     // return JSON.parse(Object.keys(JSON.parse(res.sign)).)
    // })
    DB_CONSOLE_LOGS && console.log(result)
    totalSignCount = (result.length && result[0].sign_count) || 0
    totalPages = Math.ceil(totalSignCount / limit)
    const collection_name = result[0]?.collection_name
    console.log({
        signs: result,
        totalPages,
        totalSignCount,
        offset,
        limit,
        collection_name,
    })
    return {
        signs: result,
        totalPages,
        totalSignCount,
        offset,
        limit,
        collection_name,
    }
}

const getRandomSign = async () => {
    // const res = await query('select count(*) as sign_count from sign')
    // // DB_CONSOLE_LOGS && console.log(res)
    // const count = parseInt(res[0].sign_count)
    // // DB_CONSOLE_LOGS && console.log(count)
    // const index = Math.floor(Math.random() * count)
    // // DB_CONSOLE_LOGS && console.log(index)
    // const signs = await query(`select * from sign limit 1 offset ${index}`)
    const signs = await query(`select * from sign order by random() limit 1`)
    DB_CONSOLE_LOGS && console.log(signs[0])
    return signs[0].id
}

const listHandforms = async () => {
    const handforms = await query(
        `select distinct handform from sign order by handform`
    )
    DB_CONSOLE_LOGS && console.log(handforms)
    return handforms.map((hf) => {
        if (hf.handform != '') {
            return hf.handform
        }
    })
}

const listSignDetails = async () => {
    const handform = await query(
        `select distinct handform from sign where handform is not null order by handform`
    )
    const myndunarstadur = await query(
        `select distinct myndunarstadur from sign where myndunarstadur is not null order by myndunarstadur`
    )
    const ordflokkur = await query(
        `select distinct ordflokkur from sign where ordflokkur is not null order by ordflokkur`
    )
    const efnisflokkur = await query(
        `select distinct text from efnisflokkur where text is not null and text is not "" order by text`
    )
    DB_CONSOLE_LOGS && console.log(efnisflokkur)

    return {
        handform: handform.map((hf) => hf.handform),
        myndunarstadur: myndunarstadur.map((ms) => ms.myndunarstadur),
        ordflokkur: ordflokkur.map((ordfl) => ordfl.ordflokkur),
        efnisflokkur: efnisflokkur.map((efnisfl) => efnisfl.text),
    }
}

export {
    query,
    getSignById,
    getSignByPhrase,
    searchSigns,
    signSearchWithCollectionId,
    getCollectionById,
    checkSignInCollection,
    addSignToCollection,
    deleteSignFromCollection,
    searchPagedCollectionById,
    getSignByIdJson,
    getUserById,
    getRandomSign,
    createCollection,
    deleteCollection,
    searchPagedCollectionByIdRefactor,
    listHandforms,
    listSignDetails,
    exportDB,
    listDefaultCollections,
    createCollectionFromJson,
}
