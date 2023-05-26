import {
    useMatch,
    MakeGenerics,
    Navigate,
    useNavigate,
    Link,
} from '@tanstack/react-location'
import { Header } from './Header'
import { FormEvent, useState } from 'react'
import { createCollection, deleteCollection, getUserById } from '../db'
import { useQuery } from '@tanstack/react-query'
type UserGenerics = MakeGenerics<{
    LoaderData: {
        user?: {
            name: string
            id: number
            collections: [{ name: string; id: number }]
        }
    }
}>

export function CollectionsPage() {
    const [collectionsKey, setCollectionsKey] = useState(0)
    const navigate = useNavigate()

    const [editingName, setEditingName] = useState(false)

    const onKeyUpEditName = (ev: KeyboardEvent) => {
        if (ev.key === 'Enter') {
            setEditingName(false)
            console.log('lololololol')
        }
        ev.stopPropagation()
    }

    function handleSubmit(ev: FormEvent) {
        console.log(ev)
        ev.preventDefault()
        //@ts-ignore
        const newCollectionName = ev.target.elements.name.value
        //@ts-ignore
        ev.target.elements.name.value = ''
        if (!newCollectionName) {
            return
        }
        createCollection({
            userId: user!.id,
            collectionName: newCollectionName,
        })
        setCollectionsKey(collectionsKey + 1)
        //@ts-ignore
        console.log(ev.target.elements.name.value)
    }

    function handleDeleteCollection(id: number) {
        deleteCollection({ collectionId: id })
        setCollectionsKey(collectionsKey + 1)
    }

    const {
        data: { user },
    } = useMatch<UserGenerics>()

    const { data, isPlaceholderData, isLoading, isError } = useQuery({
        queryKey: ['collections', collectionsKey ?? null, collectionsKey],
        queryFn: () => getUserById(user!.id),
        keepPreviousData: true,
        staleTime: 0,
    })

    if (isLoading) {
        return <div></div>
    }
    if (isError) {
        return <div> 'Error.'</div>
    }
    return (
        <>
            <Header></Header>
            <div className="" style={{ padding: '1rem' }} key={collectionsKey}>
                {/* <div style={{ display: 'flex' }}> */}

                <h1 style={{ flexGrow: 1 }} contentEditable={editingName}>
                    {data?.name}
                </h1>
                {/* <button
                        style={{
                            display: 'flex',
                            alignContent: 'space-evenly',
                            justifyContent: 'space-evenly',
                            borderRadius: '10px',
                        }}
                        onClick={() => setEditingName(!editingName)}
                        onKeyUp={(ev) => onKeyUpEditName(ev)}
                    >
                        <span
                            className="material-icons"
                            style={{
                                color: 'var(--accent-color)',
                            }}
                        >
                            delete
                        </span>
                        <span
                            style={{
                                alignSelf: 'center',
                            }}
                        >
                            Eyða
                        </span>
                    </button> */}
                {/* </div> */}

                <ul className="" style={{ padding: 0 }}>
                    {data?.collections
                        ?.filter((collection) => collection.id != 1)
                        .map((collection, idx) => {
                            return (
                                collection.id && (
                                    <li
                                        key={collection.id}
                                        className=""
                                        style={{
                                            display: 'flex',
                                            padding: '1rem',
                                            justifyContent: 'space-between',
                                            // boxShadow: 'var(--card-box-shadow)',
                                            borderBottom:
                                                idx !=
                                                data?.collections.length - 2
                                                    ? '1px dotted gray'
                                                    : undefined,
                                        }}
                                    >
                                        <Link
                                            to={'/collection'}
                                            search={(old) => ({
                                                ...old,
                                                scroll: 0,
                                                id: collection.id,
                                            })}
                                            style={{
                                                display: 'flex',
                                                flexGrow: 1,
                                                justifyContent: 'space-between',
                                            }}
                                        >
                                            <div>{collection.name}</div>
                                            {/* <div>{collection[key]}</div> */}
                                        </Link>
                                        <button
                                            style={{
                                                display: 'flex',
                                                alignContent: 'center',
                                                justifyContent: 'center',
                                                borderRadius: '10px',
                                            }}
                                            onClick={() =>
                                                handleDeleteCollection(
                                                    collection.id
                                                )
                                            }
                                        >
                                            <span
                                                className="material-icons"
                                                style={{
                                                    color: 'var(--accent-color)',
                                                }}
                                            >
                                                delete
                                            </span>
                                            <span
                                                style={{
                                                    alignSelf: 'center',
                                                }}
                                            >
                                                Eyða
                                            </span>
                                        </button>
                                    </li>
                                )
                            )
                            {
                                /* {Object.keys(collection).map((key) => {
                      return (
                          <Link
                              to={'/collection'}
                              search={(old) => ({
                                  ...old,
                                  scroll: 0,
                                  id: collection.id,
                              })}
                              style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                              }}
                          >
                              <div>{key}</div>
                              <div>{collection[key]}</div>
                          </Link>
                      )
                  })} */
                            }
                            {
                                /* <div className="card">{collection.name}</div> */
                            }
                        })}
                </ul>
                <form
                    style={{
                        // borderTop: '2px solid black',
                        padding: '1rem 0',
                        // boxSizing: 'border-box',
                    }}
                    onSubmit={handleSubmit}
                >
                    <hr />
                    <label htmlFor="">
                        <h3>Nýtt táknasafn</h3>
                        <input
                            type="text"
                            name=""
                            id="name"
                            placeholder="Nafn"
                            style={{ minWidth: '50%' }}
                        />
                    </label>
                    <button
                        type="submit"
                        style={{
                            borderRadius: '10px',
                            fontSize: '1rem',
                            padding: '0.5rem',
                            margin: '0 0.5rem',
                        }}
                    >
                        Staðfesta
                    </button>
                </form>
            </div>
        </>
    )
}
