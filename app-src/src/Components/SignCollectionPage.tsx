import { useState, useRef, useEffect } from 'react'
import { Pagination } from './Pagination'
import { searchPagedCollectionByIdRefactor } from '../db'
import {
    Link,
    useSearch,
    useNavigate,
    useMatch,
} from '@tanstack/react-location'
import './SignCollectionPage.css'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Header } from './Header'
import { SignCollectionGenerics, SignGenerics } from './Generics'

import { MyLocationGenerics } from './Generics'
import { SignCollectionItem } from './SignCollectionItem'
import { SelectCollection } from './SelectCollection'
import { SignFilter } from './SignFilter'
import { Footer } from './Footer'

export function SignCollectionPage() {
    const queryClient = useQueryClient()
    const {
        data: { signCollection, user },
    } = useMatch<SignCollectionGenerics & SignGenerics>()
    const [editing, setEditing] = useState(false)
    useEffect(() => {
        return () => setEditing(false)
    }, [])

    // const inputRef = useRef<HTMLInputElement>(null)
    const [page, setPage] = useState(1)
    const scrollRef = useRef<HTMLDivElement>(null)
    // const params = new URLSearchParams(window.location.search)
    useEffect(() => {
        setTimeout(() => {
            const scrollTarget = Number(search.scroll) ?? 0
            window.scrollTo({ top: scrollTarget })
        }, 200)
    }, [])
    let lastScroll = 0
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
        window.addEventListener('scroll', handleScroll)

        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])

    const search = useSearch<MyLocationGenerics>()
    useEffect(() => {
        setPage(Number(search.page ?? 1))
        setSearchValue(search.query ?? '')
        // if (inputRef.current) {
        //     inputRef.current.value = ''
        //     inputRef.current.value = params.get('query') ?? ''
        // }
        window.scrollTo({ top: 0 })
    }, [search.page, search.query])

    const [searchValue, setSearchValue] = useState('')

    const handleSearch = (query: string) => {
        setSearchValue(query)
        if (query[query.length - 1] != '´') {
            navigate({
                search: (old) => ({ ...old, query: query, page: 1, scroll: 0 }),
                replace: true,
            })
            // scrollRef.current?.scrollTo({ top: 0 })
        }
    }

    const updatePage = (page: number) => {
        navigate({
            search: (old) => ({
                ...old,
                query: searchValue,
                page: page,
                scroll: 0,
            }),
        })
    }
    const navigate = useNavigate<MyLocationGenerics>()

    // const [orderBy, setOrderBy] = useState(search.orderBy)
    // useEffect(() => {
    //     setOrderBy({ value: 'az', order: 'asc', ...search.orderBy })
    //     queryClient.invalidateQueries()
    //     console.log(search)
    // }, [search.orderBy])

    const { data, isPlaceholderData, isLoading, isError } = useQuery({
        queryKey: [
            'signs',
            search,
            // searchValue,
            // page,
            // 'collectionId: ' + search.id,
            // 'orderBy: ' + search.orderBy,
        ],
        queryFn: () =>
            searchPagedCollectionByIdRefactor({
                searchValue: search.query ?? '',
                collectionId: search.id ?? 1,
                page: search.page ?? 1,
                orderBy: search.orderBy ?? { order: 'asc', value: 'az' },
                handform: search.handform,
                ordflokkur: search.ordflokkur,
                efnisflokkur: search.efnisflokkur,
                myndunarstadur: search.myndunarstadur,
            }),

        staleTime: 0,
        cacheTime: 0,
        // refetchInterval: 10,
        keepPreviousData: true,
    })

    if (isLoading) {
        return <div></div>
    }
    if (isError) {
        return <div>'Error.'</div>
    }

    return (
        <>
            <Header>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0 1rem',
                    }}
                >
                    <div style={{ flexBasis: '100%' }}></div>
                    <div style={{ flexBasis: '100%' }}>
                        <SelectCollection
                            currentCollection={
                                user?.collections?.find(
                                    (collection) => collection.id == search.id
                                )?.name
                            }
                            collections={user?.collections}
                        />
                    </div>
                    <div style={{ flexBasis: '100%' }}>
                        {search.id != 1 && (
                            <span
                                style={{
                                    float: 'right',
                                    // padding: '0 1rem',
                                    fontSize: '1.3rem',
                                    fontStyle: editing ? 'italic' : undefined,
                                    cursor: 'pointer',
                                }}
                                onClick={() => setEditing(!editing)}
                            >
                                Breyta
                            </span>
                        )}
                    </div>
                </div>

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
                        placeholder="Leita að tákni"
                        value={searchValue}
                        // style={{ height: '100%' }}
                        // ref={inputRef}
                    />
                </div>
            </Header>

            {data && (
                <div className="signlist" ref={scrollRef}>
                    <Pagination
                        key={search.page}
                        offset={data.offset}
                        totalPages={data.totalPages}
                        totalSignCount={data.totalSignCount}
                        updatePage={updatePage}
                        limit={data.limit}
                        currentPage={page}
                    />
                    {data.signs.map((sign) => {
                        return (
                            <SignCollectionItem
                                key={sign.sign_id}
                                sign={sign}
                                user={user}
                                currentCollection={search.id}
                                queryKey={[
                                    'signs',
                                    searchValue,
                                    page,
                                    'collectionId: ' + search.id,
                                ]}
                                editing={search.id != 1 && editing}
                            />
                        )
                    })}
                    {data.totalSignCount > 40 &&
                        page != data.totalPages - 1 && (
                            <Pagination
                                offset={data.offset}
                                totalPages={data.totalPages}
                                totalSignCount={data.totalSignCount}
                                updatePage={updatePage}
                                limit={data.limit}
                                currentPage={page}
                            />
                        )}
                </div>
            )}
            <Footer />
        </>
    )
}
