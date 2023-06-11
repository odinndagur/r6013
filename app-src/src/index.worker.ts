import initSqlJs from '@jlongster/sql.js/dist/sql-wasm'
import { SQLiteFS } from 'absurd-sql'
import IndexedDBBackend from 'absurd-sql/dist/indexeddb-backend'
import registerPromiseWorker from 'promise-worker/register'

function isNumber(n: any) {
    return !isNaN(parseFloat(n)) && !isNaN(n - 0)
}

function intersect(a: string, b: string) {
    var setA = new Set(a)
    var setB = new Set(b)
    var intersection = new Set([...setA].filter((x) => setB.has(x)))
    return Array.from(intersection)
}

// Javascript function to calculate optimal string alignment distance
function optimalStringAlignmentDistance(s1: string, s2: string) {
    // Create a table to store the results of subproblems
    s1 = s1.toLocaleLowerCase()
    s2 = s2.toLocaleLowerCase()
    if (intersect(s1, s2).length == 0) {
        return Infinity
    }
    let dp = new Array(s1.length + 1)
        .fill(0)
        .map(() => new Array(s2.length + 1).fill(0))

    // Initialize the table
    for (let i = 0; i <= s1.length; i++) {
        dp[i][0] = i
    }
    for (let j = 0; j <= s2.length; j++) {
        dp[0][j] = j
    }

    // Populate the table using dynamic programming
    for (let i = 1; i <= s1.length; i++) {
        for (let j = 1; j <= s2.length; j++) {
            if (s1[i - 1] === s2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1]
            } else {
                dp[i][j] =
                    1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
            }
        }
    }

    // Return the edit distance

    const commonPrefix = commonPrefixLength(s1, s2)
    const minLength = Math.min(s1.length, s2.length)
    const containsEntireWord = s1.includes(s2) ? minLength : 0
    // return containsEntireWord
    return (
        dp[s1.length][s2.length] -
        containsEntireWord / 2 -
        commonPrefix * minLength
    )
}

// This code is contributed by lokeshpotta20.

// function jaro_distance(s1: string, s2: string) {
//     // If the strings are equal
//     if (s1 == s2) return 1.0

//     // Length of two strings
//     var len1 = s1.length,
//         len2 = s2.length

//     // Maximum distance upto which matching
//     // is allowed
//     var max_dist = Math.floor(Math.max(len1, len2) / 2) - 1

//     // Count of matches
//     var match = 0

//     // Hash for matches
//     var hash_s1 = Array(s1.length).fill(0)
//     var hash_s2 = Array(s1.length).fill(0)

//     // Traverse through the first string
//     for (var i = 0; i < len1; i++) {
//         // Check if there is any matches
//         for (
//             var j = Math.max(0, i - max_dist);
//             j < Math.min(len2, i + max_dist + 1);
//             j++
//         )
//             // If there is a match
//             if (s1[i] == s2[j] && hash_s2[j] == 0) {
//                 hash_s1[i] = 1
//                 hash_s2[j] = 1
//                 match++
//                 break
//             }
//     }

//     // If there is no match
//     if (match == 0) return 0.0

//     // Number of transpositions
//     var t = 0

//     var point = 0

//     // Count number of occurrences
//     // where two characters match but
//     // there is a third matched character
//     // in between the indices
//     for (var i = 0; i < len1; i++)
//         if (hash_s1[i]) {
//             // Find the next matched character
//             // in second string
//             while (hash_s2[point] == 0) point++

//             if (s1[i] != s2[point++]) t++
//         }

//     t /= 2

//     // Return the Jaro Similarity
//     return (match / len1 + match / len2 + (match - t) / match) / 3.0
// }
// Javascript implementation of above approach

// Function to calculate the
// Jaro Similarity of two strings
function jaro_distance(s1: string, s2: string) {
    // If the strings are equal
    if (s1 == s2) return 1.0

    // Length of two strings
    let len1 = s1.length,
        len2 = s2.length

    if (len1 == 0 || len2 == 0) return 0.0

    // Maximum distance upto which matching
    // is allowed
    let max_dist = Math.floor(Math.max(len1, len2) / 2) - 1

    // Count of matches
    let match = 0

    // Hash for matches
    let hash_s1 = new Array(s1.length)
    hash_s1.fill(0)
    let hash_s2 = new Array(s2.length)
    hash_s2.fill(0)

    // Traverse through the first string
    for (let i = 0; i < len1; i++) {
        // Check if there is any matches
        for (
            let j = Math.max(0, i - max_dist);
            j < Math.min(len2, i + max_dist + 1);
            j++
        )
            // If there is a match
            if (s1[i] == s2[j] && hash_s2[j] == 0) {
                hash_s1[i] = 1
                hash_s2[j] = 1
                match++
                break
            }
    }

    // If there is no match
    if (match == 0) return 0.0

    // Number of transpositions
    let t = 0

    let point = 0

    // Count number of occurrences
    // where two characters match but
    // there is a third matched character
    // in between the indices
    for (let i = 0; i < len1; i++)
        if (hash_s1[i] == 1) {
            // Find the next matched character
            // in second string
            while (hash_s2[point] == 0) point++

            if (s1[i] != s2[point++]) t++
        }
    t /= 2

    // Return the Jaro Similarity
    return (match / len1 + match / len2 + (match - t) / match) / 3.0
}

// Jaro Winkler Similarity
function jaro_Winkler(s1: string, s2: string) {
    let jaro_dist = jaro_distance(s1, s2)

    // If the jaro Similarity is above a threshold
    if (jaro_dist > 0.7) {
        // Find the length of common prefix
        let prefix = 0

        for (let i = 0; i < Math.min(s1.length, s2.length); i++) {
            // If the characters match
            if (s1[i] == s2[i]) prefix++
            // Else break
            else break
        }

        // Maximum of 4 characters are allowed in prefix
        prefix = Math.min(4, prefix)

        // Calculate jaro winkler Similarity
        jaro_dist += 0.1 * prefix * (1 - jaro_dist)
    }
    return jaro_dist.toFixed(6)
}

const levenshteinDistance = (str1 = '', str2 = '') => {
    const track = Array(str2.length + 1)
        .fill(null)
        .map(() => Array(str1.length + 1).fill(null))
    for (let i = 0; i <= str1.length; i += 1) {
        track[0][i] = i
    }
    for (let j = 0; j <= str2.length; j += 1) {
        track[j][0] = j
    }
    for (let j = 1; j <= str2.length; j += 1) {
        for (let i = 1; i <= str1.length; i += 1) {
            const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1
            track[j][i] = Math.min(
                track[j][i - 1] + 1, // deletion
                track[j - 1][i] + 1, // insertion
                track[j - 1][i - 1] + indicator // substitution
            )
        }
    }
    return track[str2.length][str1.length]
}

const commonPrefixLength = (str1 = '', str2 = '') => {
    str1 = str1.toLocaleLowerCase()
    str2 = str2.toLocaleLowerCase()
    let i = 0
    while (i < str1.length && i < str2.length && str1[i] === str2[i]) {
        i += 1
    }
    return i
}

const levenshteinDistanceWithStartPenalty = (str1 = '', str2 = '') => {
    const track = Array(str2.length + 1)
        .fill(null)
        .map(() => Array(str1.length + 1).fill(null))
    const commonPrefixLen = commonPrefixLength(str1, str2)
    const startPenalty = Math.min(
        commonPrefixLen,
        Math.min(str1.length, str2.length)
    )

    for (let i = 0; i <= str1.length; i += 1) {
        track[0][i] = i
    }
    for (let j = 0; j <= str2.length; j += 1) {
        track[j][0] = j
    }
    for (let j = 1; j <= str2.length; j += 1) {
        for (let i = 1; i <= str1.length; i += 1) {
            const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1
            let cost = Math.min(
                track[j][i - 1] + 1, // deletion
                track[j - 1][i] + 1, // insertion
                track[j - 1][i - 1] + indicator // substitution
            )
            if (i - 1 < startPenalty && j - 1 < startPenalty) {
                cost -= startPenalty - Math.min(i - 1, j - 1)
            }
            track[j][i] = cost
        }
    }
    return track[str2.length][str1.length]
}

async function run() {
    console.log('yo')
    let SQL
    SQL = await initSqlJs({
        locateFile: (file: String) =>
            `${import.meta.env.BASE_URL}assets/${file}`,
    })
    let sqlFS = new SQLiteFS(SQL.FS, new IndexedDBBackend())
    SQL.register_for_idb(sqlFS)

    SQL.FS.mkdir('/sql')
    SQL.FS.mount(sqlFS, {}, '/sql')
    const path = '/sql/sign.sqlite'
    if (typeof SharedArrayBuffer === 'undefined') {
        let stream = SQL.FS.open(path, 'a+')
        await stream.node.contents.readIfFallback()
        SQL.FS.close(stream)
    }

    let db = new SQL.Database(path, { filename: true })
    // You might want to try `PRAGMA page_size=8192;` too!
    db.exec(`
  PRAGMA journal_mode=MEMORY;
  `)

    function toObjects(res: any) {
        return res.flatMap((r: any) =>
            r.values.map((v: any) => {
                const o: any = {}
                for (let i = 0; i < r.columns.length; i++) {
                    o[r.columns[i]] = v[i]
                }
                return o
            })
        )
    }
    db.query = (...args: any[]) => toObjects(db!.exec(...args))
    db.create_function('levenshtein', (a: string, b: string) =>
        // levenshteinDistanceWithStartPenalty(a, b)
        // jaro_distance(a, b)
        optimalStringAlignmentDistance(a, b)
    )

    // function toAscii(a: string) {
    //     return a
    // }

    // db.create_function('to_ascii', (a: string) => toAscii(a))

    const currentVersion = 4
    let initDB = false
    try {
        console.log('try')
        db.exec('select * from sign_fts limit 5')
        const res = db.query('pragma user_version')
        const user_version = res[0].user_version
        console.log('pragma user version', user_version, currentVersion)
        if (res.length && user_version != currentVersion) {
            initDB = true
            db.exec(`PRAGMA writable_schema = 1;
            delete from sqlite_master where type in ('table', 'index', 'trigger');
            PRAGMA writable_schema = 0;
            VACUUM;
            PRAGMA INTEGRITY_CHECK`)
        }
    } catch (error) {
        console.log('except')
        initDB = true
    }
    if (initDB) {
        // let filepathPrefix = `${import.meta.env.BASE_URL}`
        // const filepaths = [
        //     `${filepathPrefix}assets/sign_tables.txt`,
        //     `${filepathPrefix}assets/sign_db_data.txt`,
        //     `${filepathPrefix}assets/signftstableftsdata.txt`,
        // ]
        // for (let filepath of filepaths) {
        //     if (filepath.includes('db_data')) {
        //         for await (let line of makeTextFileLineIterator(filepath)) {
        //             // console.log(line)
        //             try {
        //                 db.exec(line)
        //             } catch (error) {
        //                 console.error(error)
        //             }
        //         }
        //     } else {
        //         for await (let line of splitTextFileBySemicolon(filepath)) {
        //             // console.log(line)
        //             try {
        //                 db.exec(line)
        //             } catch (error) {
        //                 console.error(error)
        //             }
        //         }
        //     }
        // }
        // // db.exec()
        // db.exec('INSERT INTO user(name,id) VALUES("ÍTM",1)')
        // db.exec(
        //     'INSERT INTO collection(id,user_id,name) VALUES(1,1,"Öll tákn")'
        // )
        // db.exec(
        //     'INSERT INTO sign_collection(sign_id,collection_id) SELECT sign.id, 1 FROM sign'
        // )
        // db.exec('INSERT INTO user(name, id) VALUES("Ég",3);')
        // db.exec(
        //     'INSERT INTO collection(id,user_id,name) VALUES(3,3,"Mín tákn");'
        // )
        // db.exec(`pragma user_version = ${currentVersion}`)
        let filepathPrefix = `${import.meta.env.BASE_URL}`
        const filepaths = [`${filepathPrefix}assets/r6014.sqlite3.txt`]
        for (let filepath of filepaths) {
            if (filepath.includes('db_data')) {
                for await (let line of makeTextFileLineIterator(filepath)) {
                    console.log(line)
                    try {
                        db.exec(line)
                    } catch (error) {
                        console.error(error)
                    }
                }
            } else {
                for await (let line of splitTextFileBySemicolon(filepath)) {
                    console.log(line)
                    try {
                        db.exec(line)
                    } catch (error) {
                        console.error(error)
                    }
                }
            }
        }
        // db.exec()
        // db.exec('INSERT INTO user(name,id) VALUES("ÍTM",1)')
        // db.exec(
        //     'INSERT INTO collection(id,user_id,name) VALUES(1,1,"Öll tákn")'
        // )
        // db.exec(
        //     'INSERT INTO sign_collection(sign_id,collection_id) SELECT sign.id, 1 FROM sign'
        // )
        // db.exec('INSERT INTO user(name, id) VALUES("Ég",3);')
        // db.exec(
        //     'INSERT INTO collection(id,user_id,name) VALUES(3,3,"Mín tákn");'
        // )
        // db.exec(`pragma user_version = ${currentVersion}`)
    }

    async function listDefaultCollections() {
        let filepathPrefix = `${import.meta.env.BASE_URL}`
        let collectionFilePath = `${filepathPrefix}default-collections.json`
        const json_response = fetch(collectionFilePath).then((res) =>
            res.json()
        )
        // let res = []
        // for await (let line of makeTextFileLineIterator(collectionFilePath)) {
        //     // console.log(line)
        //     res.push(line)
        // }
        return json_response
        // `${filepathPrefix}assets/sign_tables.txt`,

        // for await (let line of makeTextFileLineIterator(filepath)) {
    }

    registerPromiseWorker(async function (
        message: absurdSqlPromiseWorkerMessage
    ) {
        switch (message.type) {
            case 'sql':
                return db.query(message.query)
            case 'exec':
                db.exec(message.query)
                break
            case 'export':
                return db.export()
            case 'listCollections':
                return listDefaultCollections()
        }
    })
}

run()

async function* makeTextFileLineIterator(fileURL: string) {
    const utf8Decoder = new TextDecoder('utf-8')
    let response = await fetch(fileURL)
    let reader = response!.body!.getReader()
    let { value: chunk, done: readerDone } = await reader.read()
    chunk = chunk ? utf8Decoder.decode(chunk, { stream: true }) : ''

    let re = /\r\n|\n|\r/gm
    let startIndex = 0

    for (;;) {
        let result = re.exec(chunk)
        if (!result) {
            if (readerDone) {
                break
            }
            let remainder = chunk.substr(startIndex)
            ;({ value: chunk, done: readerDone } = await reader.read())
            chunk =
                remainder +
                (chunk ? utf8Decoder.decode(chunk, { stream: true }) : '')
            startIndex = re.lastIndex = 0
            continue
        }
        yield chunk.substring(startIndex, result.index)
        startIndex = re.lastIndex
    }
    if (startIndex < chunk.length) {
        // last line didn't end in a newline char
        yield chunk.substr(startIndex)
    }
}
async function lineDoer() {
    for await (let line of makeTextFileLineIterator('data.txt')) {
        processLine(line)
    }
}

async function* splitTextFileBySemicolon(fileURL: string) {
    const utf8Decoder = new TextDecoder('utf-8')
    let response = await fetch(fileURL)
    let reader = response!.body!.getReader()
    let { value: chunk, done: readerDone } = await reader.read()
    chunk = chunk ? utf8Decoder.decode(chunk, { stream: true }) : ''

    let re = /;/gm
    let startIndex = 0

    for (;;) {
        let result = re.exec(chunk)
        if (!result) {
            if (readerDone) {
                break
            }
            let remainder = chunk.substr(startIndex)
            ;({ value: chunk, done: readerDone } = await reader.read())
            chunk =
                remainder +
                (chunk ? utf8Decoder.decode(chunk, { stream: true }) : '')
            startIndex = re.lastIndex = 0
            continue
        }
        yield chunk.substring(startIndex, result.index)
        startIndex = re.lastIndex
    }
    if (startIndex < chunk.length) {
        // last line didn't end in a newline char
        yield chunk.substr(startIndex)
    }
}
