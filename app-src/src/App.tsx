import { useState, useEffect, Suspense } from 'react'
import { ThemeContext } from './Components/ThemeContext'
import SignPage from './Components/SignPage'
import HomePage from './Components/Home'
import {
    query,
    getSignByPhrase,
    getSignByIdJson,
    searchPagedCollectionById,
    getUserById,
    getRandomSign,
    searchPagedCollectionByIdRefactor,
    listHandforms,
} from './db'
import {
    ReactLocation,
    Router,
    Outlet,
    Navigate,
} from '@tanstack/react-location'

import PlaceholderScreen from './Components/PlaceholderScreen'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppNavBar } from './Components/AppNavBar'
import { DarkModeSwitch } from './Components/DarkModeSwitch'
import { NotFound } from './Components/NotFound'
import { CollectionsPage } from './Components/CollectionsPage'
import { RandomSign } from './Components/RandomSign'
import { SignCollectionPage } from './Components/SignCollectionPage'
import { MyLocationGenerics } from './Components/Generics'
import { RawSql } from './Components/RawSql'
import { GetCollections } from './Components/GetCollections'
import { Footer } from './Components/Footer'
import { Header } from './Components/Header'

const reactLocation = new ReactLocation()

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // staleTime: 1000 * 60 * 5,
            networkMode: 'offlineFirst',
        },
    },
})

function App() {
    const [standalone, setStandalone] = useState(false)
    useEffect(() => {
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setStandalone(true)
        }
    })
    const [promiseWorkerLoaded, setPromiseWorkerLoaded] = useState(false)
    const [currentTheme, setCurrentTheme] = useState(
        window.localStorage.getItem('theme_mode') ?? 'light'
    )
    useEffect(() => {
        const intervalID = setInterval(() => {
            console.log('callback yo')
            try {
                query('select * from band_member limit 5').then((res: any) => {
                    if (res[0]) {
                        clearInterval(intervalID)
                        setPromiseWorkerLoaded(true)
                        console.log('promise worker loaded')
                    }
                })
            } catch (error) {
                console.error(error)
            }
        }, 500)
    }, [])

    if (!promiseWorkerLoaded) {
        return
        return <PlaceholderScreen />
    }
    return (
        <Suspense>
            <QueryClientProvider client={queryClient}>
                <ThemeContext.Provider
                    value={{ currentTheme, setCurrentTheme }}
                >
                    <Router
                        location={reactLocation}
                        basepath="/"
                        // defaultLinkPreloadMaxAge={Infinity}
                        // defaultPendingElement={<PlaceholderScreen />}
                        // defaultLoaderMaxAge={Infinity}
                        routes={[
                            {
                                path: '/',
                                element: (
                                    <Navigate
                                        to={'collection'}
                                        search={{ id: 1 }}
                                    />
                                ),

                                // loader: async ({ search }) => ({
                                //     signs: await searchPagedCollectionById({
                                //         searchValue: search.query ?? '',
                                //         collectionId: search.collection ?? 1,
                                //         page: search.page ?? 1,
                                //     }),
                                // }),
                            },
                            {
                                path: 'home',
                                element: <HomePage />,
                            },
                            {
                                path: 'collection',
                                children: [
                                    {
                                        //search: (search) => 'id' in search,
                                        element: <SignCollectionPage />,
                                        loader: async ({
                                            search,
                                        }: {
                                            search: MyLocationGenerics['Search']
                                        }) => ({
                                            signCollection:
                                                await searchPagedCollectionByIdRefactor(
                                                    {
                                                        collectionId:
                                                            search.id ?? 1,
                                                        page: search.page ?? 1,
                                                        searchValue:
                                                            search.query ?? '',
                                                        orderBy:
                                                            search.orderBy ?? {
                                                                value: 'az',
                                                                order: 'asc',
                                                            },
                                                    }
                                                ),
                                            user: await queryClient.fetchQuery({
                                                queryFn: () => getUserById(3),
                                                queryKey: ['user'],
                                            }),
                                            handforms: await listHandforms(),
                                        }),
                                        loaderMaxAge: 0,
                                    },
                                ],
                            },
                            {
                                path: 'random',
                                element: <RandomSign />,
                                // element: async () =>
                                //     getRandomSign().then((signId) => (
                                //         <Navigate
                                //             to={`/signs/${signId}`}
                                //             key={signId}
                                //         />
                                //     )),
                                // loaderMaxAge: 0,

                                loader: async () => ({
                                    sign: await getSignByIdJson(
                                        await getRandomSign()
                                    ),
                                }),
                            },
                            {
                                path: 'signs',
                                children: [
                                    {
                                        path: '/',
                                        element: <SignCollectionPage />,
                                        loader: async ({
                                            search,
                                        }: {
                                            search: MyLocationGenerics['Search']
                                        }) => ({
                                            signCollection:
                                                await searchPagedCollectionByIdRefactor(
                                                    {
                                                        collectionId:
                                                            search.id ?? 1,
                                                        page: search.page ?? 1,
                                                        searchValue:
                                                            search.query ?? '',
                                                        orderBy:
                                                            search.orderBy ?? {
                                                                value: 'az',
                                                                order: 'asc',
                                                            },
                                                    }
                                                ),
                                            user: await getUserById(3),
                                        }),
                                        loaderMaxAge: 0,
                                    },
                                    {
                                        path: 'phrase',
                                        children: [
                                            {
                                                path: ':phrase',
                                                element: <SignPage />,
                                                loader: async ({ params }) => ({
                                                    sign: await getSignByPhrase(
                                                        decodeURIComponent(
                                                            params.phrase
                                                        )
                                                    ),
                                                    user: await getUserById(3),
                                                }),
                                            },
                                        ],
                                    },
                                    {
                                        path: ':id',
                                        element: <SignPage />,
                                        loader: async ({ params }) => ({
                                            sign: await getSignByIdJson(
                                                Number(params.id)
                                            ),
                                            user: await getUserById(3),
                                        }),
                                    },
                                ],
                            },
                            {
                                path: 'sign',
                                id: 'signByPhrase',
                                element: <SignPage />,
                                search: (search) => {
                                    return 'phrase' in search
                                },
                                loader: async ({ search }) => ({
                                    sign: await getSignByPhrase(
                                        String(search.phrase)
                                    ),
                                    user: await getUserById(3),
                                }),
                            },
                            {
                                path: 'sign',
                                id: 'signById',
                                element: <SignPage />,
                                search: (search) => {
                                    return 'id' in search
                                },
                                loader: async ({ search }) => ({
                                    sign: await getSignByIdJson(search.id),
                                    user: await getUserById(3),
                                }),
                            },
                            // {
                            //     path: 'settings',
                            //     element: <SettingsPage />,
                            //     loader: async () => ({
                            //         user: await getUserById(3),
                            //     }),
                            // },
                            {
                                path: 'settings',

                                element: <CollectionsPage />,
                                loader: async () => ({
                                    user: await getUserById(3),
                                }),
                                loaderMaxAge: 0,
                            },
                            {
                                path: 'leit',
                                element: <SignCollectionPage />,
                                loader: async ({ search }) => ({
                                    signCollection:
                                        await searchPagedCollectionById({
                                            collectionId:
                                                Number(search.id) ?? 1,
                                            page: Number(search.page) ?? 1,
                                            searchValue:
                                                String(search.query) ?? '',
                                        }),
                                    user: await getUserById(3),
                                }),
                                loaderMaxAge: 0,
                            },
                            {
                                path: 'sql',
                                element: <RawSql />,
                            },
                            {
                                path: 'default-collections',
                                element: <GetCollections />,
                            },
                            {
                                // Passing no route is equivalent to passing `path: '*'`
                                element: <NotFound />,
                            },
                        ]}
                    >
                        <Outlet />
                        {/* <AppNavBar type="footer" /> */}
                        {/* <div
                            className="dark-mode-switch-container"
                            style={{
                                position: 'fixed',
                                top: 'env(safe-area-inset-top)',
                                right: '0',
                                padding: '1rem',
                                zIndex: 9999,
                            }}
                        >
                            <DarkModeSwitch setCurrentTheme={setCurrentTheme} />
                        </div> */}

                        <dialog
                            id="app-save-modal"
                            onClick={(ev) => {
                                const dialog = document.getElementById(
                                    'app-save-modal'
                                ) as HTMLDialogElement
                                if (ev.target == dialog) {
                                    dialog.close()
                                }
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    padding: '2rem',
                                    maxWidth: '70vw',
                                }}
                            >
                                <form method="dialog" style={{}}>
                                    <button style={{ maxWidth: '2rem' }}>
                                        x
                                    </button>
                                </form>
                                <div>
                                    <h3>Vista app á síma</h3>
                                    <p>
                                        Ef þú vilt vista síðuna sem app á
                                        símanum þínum geturðu gert eftirfarandi:
                                    </p>
                                    <p>
                                        <b>iPhone:</b> Valið „share“ takkann og
                                        ýtt á Add to home screen.
                                    </p>
                                    <p>
                                        <b>Android:</b> Sumir símar birta
                                        skilaboð sem bjóða þér að „installa“
                                        appinu. Á öðrum þarftu að velja share
                                        takkann og annað hvort „Install app“ eða
                                        „Add to home screen“.
                                    </p>
                                </div>
                            </div>
                        </dialog>
                    </Router>
                </ThemeContext.Provider>
            </QueryClientProvider>
        </Suspense>
    )
}

export default App
