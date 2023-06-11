//@ts-nocheck
import {
    Link,
    useMatch,
    useNavigate,
    MakeGenerics,
    useLocation,
    useSearch,
    Navigate,
} from '@tanstack/react-location'
import YouTube from 'react-youtube'
import './signpage.css'
import { useEffect } from 'react'
import { SignPlayer } from './SignPlayer'
import { Header } from './Header'
import { Footer } from './Footer'
import { AddSignToCollection } from './AddSignToCollection'

type MyLocationGenerics = MakeGenerics<{
    Search: {
        page?: number
        query?: string
        scroll?: number
        lastSearch: { page?: number; query?: string; scroll: number }
    }
}>

type SignGenerics = MakeGenerics<{
    LoaderData: {
        sign?: {
            id: string
            phrase: string
            videos: { rank: number; video_id: string }[]
            efnisflokkar: string[]
            related_signs: { phrase: string; id: number }[]
            myndunarstadur: string
            ordflokkur: string
        }
    }
}>

function process_description(description: string) {
    const matches = description.matchAll(/\[?\[[a-zA-Z0-9|/ \p{L}]*\]?\]/gmu)
    let output = []
    let temp_last
    for (let match of matches) {
        console.log(match[0])
        // console.log(matches)
        let word = match[0]
        if (word.includes('|')) {
            word = word.split('|')[0]
        } else if (word.includes('/')) {
            word = word.split('/')[0]
        }
        word = word
            .replace('[[', '')
            .replace(']]', '')
            .replace('[', '')
            .replace(']', '')

        // const word = match[0].includes('|')
        //     ? match[0].split('|')[0].replace('[[', '').replace(']]', '')
        //     : match[0].replace('[[', '').replace(']]', '')
        // console.log(word)
        // console.log({ description: description, match: match[0] })
        const [before, _] = description.split(match[0])
        description = description.replace(before, '')
        // console.log({ before })
        const after = description.replace(match[0], '')
        description = after
        output.push(before)
        console.log(output)
        output.push(
            <Link
                to={`/signs/phrase/${word}`}
                search={(old) => ({ ...old.lastSearch })}
            >
                {word.toLocaleLowerCase()}
            </Link>
        )
        temp_last = after
        // output.push(after)
    }
    output.push(temp_last)
    if (!output.length || output.join('') == '') {
        return false
    }
    console.log('process description\n', output)
    return output
}
function SignPage() {
    const {
        data: {
            // You can access any data merged in from parent loaders as well
            sign,
            user,
        },
    } = useMatch<SignGenerics>()

    const shareSign = () => {
        if (navigator.share) {
            navigator
                .share({
                    title: sign?.phrase,
                    text: `${sign.phrase} á ${window.location.href}`,
                    url: window.location,
                })
                .then(() => console.log('Successful share'))
                .catch((error) => console.log('Error sharing', error))
        }
    }

    const navigate = useNavigate()
    const search = useSearch<MyLocationGenerics>()
    // const [scroll, setScroll] = useState(0)
    useEffect(() => {
        console.log('opened page - handling scroll')
        setTimeout(() => {
            const scrollTarget = Number(search.scroll) ?? 0
            console.log('scrolltarget: ', scrollTarget)
            window.scrollTo({ top: scrollTarget })
        }, 100)
    }, [sign])
    let lastScroll
    useEffect(() => {
        const handleScroll = (event: any) => {
            // setScroll(window.scrollY)
            console.log(window.scrollY)
            console.log(event.currentTarget.scrollY)
            const currentScroll = window.scrollY
            if (Math.abs(currentScroll - lastScroll) > 10) {
                lastScroll = currentScroll
                navigate({
                    search: (old) => ({
                        ...old,
                        scroll: window.scrollY,
                    }),
                    replace: true,
                })
            }
        }
        console.log('handlescrolluseeffect')
        window.addEventListener('scroll', handleScroll)

        return () => {
            console.log('handle scroll useeffect unmount')
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])

    return (
        <div className="sign" id={sign.id} key={sign.id}>
            <Header />

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                {search.lastSearch ? (
                    <Link
                        className="temp-card"
                        style={{ width: 'fit-content' }}
                        to={'/collection'}
                        search={{
                            ...search.lastSearch,
                            id: search.lastSearch.id ?? 1,
                        }}
                    >
                        &lt; Til baka í leit{' '}
                        {search.lastSearch.query && (
                            <i>(„{search.lastSearch.query}“)</i>
                        )}
                    </Link>
                ) : (
                    <Link
                        className="temp-card"
                        style={{ width: 'fit-content' }}
                        to={'/collection'}
                        search={{
                            id: 1,
                        }}
                    >
                        &lt; Öll tákn{' '}
                    </Link>
                )}
                {navigator.share && (
                    <div
                        className="temp-card"
                        style={{ width: 'fit-content', cursor: 'pointer' }}
                        to={'/collection'}
                        onClick={shareSign}
                    >
                        <span className="material-icons">send</span>
                    </div>
                )}
            </div>
            {/* <Link
                className="temp-card"
                style={{ width: 'fit-content' }}
                to={'/signs'}
                search={search.lastSearch}
            >
                &lt; Til baka í leit{' '}
                {search.lastSearch.query && (
                    <i>(„{search.lastSearch.query}“)</i>
                )}
            </Link> */}
            <div className="card">
                <div style={{ maxWidth: 'max(80%,400px)', margin: 'auto' }}>
                    <div
                        style={{
                            display: 'flex',
                            zIndex: 50,
                            margin: 'auto',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '1rem',
                        }}
                    >
                        <Link>
                            <h2 className="sign-phrase">{sign.phrase}</h2>
                        </Link>
                        <AddSignToCollection
                        centered
                            id={sign.id}
                            sign={sign}
                            collections={user.collections}
                            zIndex={500}
                        />
                    </div>
                    <SignPlayer
                        iframeClassName="video-responsive"
                        videoId={sign.videos[0]}
                        title={sign.phrase}
                    />
                </div>
                <div className="sign-info properties">
                    {sign.efnisflokkar && (
                        <div className="sign-info-item property">
                            <h3>Efnisflokkar</h3>
                            {sign.efnisflokkar.map((efnisflokkur) => {
                                return (
                                    <div key={efnisflokkur}>
                                        {/* <Link
                                            to={`/efnisflokkar/${efnisflokkur}`}
                                        > */}
                                        {efnisflokkur}
                                        {/* </Link> */}
                                    </div>
                                )
                            })}
                        </div>
                    )}
                    {sign.ordflokkur && (
                        <div className="sign-info-item property">
                            <h3>Orðflokkur</h3>
                            <div>
                                {/* <Link to={`/ordflokkar/${sign.ordflokkur}`}> */}
                                {sign.ordflokkur}
                                {/* </Link> */}
                            </div>
                        </div>
                    )}
                    {sign.myndunarstadur && (
                        <div className="sign-info-item property">
                            <h3>Myndunarstaður</h3>
                            <div>
                                {/* <Link
                                    to={`/myndunarstadir/${sign.myndunarstadur}`}
                                > */}
                                {sign.myndunarstadur}
                                {/* </Link> */}
                            </div>
                        </div>
                    )}
                    {sign.handform && (
                        <div className="sign-info-item property">
                            <h3>Handform</h3>
                            {/* <Link to={`/handform/${sign.handform}`}> */}
                            {sign.handform}

                            {/* <img
                                    className="handform-img"
                                    src={`/assets/itm-images/handform/${sign.handform}.png`}
                                /> */}
                            {/* </Link> */}
                        </div>
                    )}
                    {sign.munnhreyfing && (
                        <div className="sign-info-item property">
                            <h3>Munnhreyfing</h3>
                            <div>{sign.munnhreyfing}</div>
                        </div>
                    )}
                    {sign.description && (
                        <div className="sign-info-item property">
                            <h3>Lýsing</h3>
                            <div>
                                {/* {sign.description} */}
                                {/* {process_description(sign.description)} */}
                                {process_description(sign.description)
                                    ? process_description(sign.description).map(
                                          (part, idx) => {
                                              return (
                                                  <span key={idx}>{part}</span>
                                              )
                                          }
                                      )
                                    : sign.description}
                            </div>
                        </div>
                    )}
                </div>
                <div className="center pad">
                    <i>
                        <a
                            href={`https://is.signwiki.org/index.php?curid=${sign.id}`}
                        >
                            „{sign.phrase}“ á SignWiki
                        </a>
                    </i>
                </div>
            </div>
            {(sign.islenska || sign.taknmal) && (
                <div className="card">
                    <h2 className="center pad">Fleiri dæmi</h2>
                    <div className="alternate-videos">
                        {sign.videos.slice(1).map((id) => {
                            return (
                                id && (
                                    <div className="alternate-video" key={id}>
                                        <SignPlayer
                                            videoId={id}
                                            title={sign.phrase}
                                        />
                                    </div>
                                )
                            )
                        })}
                    </div>
                    <div className="sign-info">
                        {sign.islenska && (
                            <div className="sign-info-item pad">
                                <h3>Íslenska</h3>
                                <div>{sign.islenska}</div>
                            </div>
                        )}
                        {sign.taknmal && (
                            <div className="sign-info-item pad">
                                <h3>Táknmál</h3>
                                <div>{sign.taknmal}</div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {sign.related_signs && (
                <div className="sign-info-item">
                    <div className="flexcol related-signs card">
                        <div>
                            <h3>Tengd tákn</h3>
                        </div>
                        {sign.related_signs.map((related_sign) => {
                            return (
                                <Link
                                    key={related_sign.id}
                                    to={`/signs/${related_sign.id}`}
                                    search={(old) => ({ ...old, scroll: 0 })}
                                >
                                    <div
                                        className="pad"
                                        style={{ fontSize: '1.3rem' }}
                                    >
                                        {related_sign.phrase}
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                </div>
            )}
            <Footer/>
        </div>
    )
}

export default SignPage
