import {
    useMatch,
    MakeGenerics,
    Navigate,
    useNavigate,
    Link,
} from '@tanstack/react-location'
import { Header } from './Header'
import { FormEvent, useState } from 'react'
import {
    createCollection,
    createCollectionFromJson,
    deleteCollection,
    exportDB,
    getUserById,
    listDefaultCollections,
    query,
} from '../db'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import './CollectionsPage.css'
import { Footer } from './Footer'
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
    const { data: defaultCollections } = useQuery({
        queryFn: () => listDefaultCollections(),
        queryKey: ['default-collections'],
    })

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
    const queryKey = ['collections', collectionsKey ?? null, collectionsKey]
    const { data, isPlaceholderData, isLoading, isError } = useQuery({
        queryKey: queryKey,
        queryFn: () => getUserById(user!.id),
        keepPreviousData: true,
        staleTime: 0,
    })

    const queryClient = useQueryClient()

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
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <h1 style={{ flexGrow: 1 }} contentEditable={editingName}>
                        {data?.name}
                    </h1>
                    <button
                        className="button-17"
                        onClick={() => {
                            const editUserModal = document.getElementById(
                                'edit-user-modal'
                            ) as HTMLDialogElement
                            editUserModal.showModal()
                        }}
                    >
                        Breyta
                    </button>
                    <dialog
                        onClick={(ev) => {
                            const dialog = document.getElementById(
                                'edit-user-modal'
                            ) as HTMLDialogElement
                            if (ev.target === dialog) {
                                dialog.close()
                            }
                        }}
                        id="edit-user-modal"
                    >
                        <form method="dialog">
                            <button className="material-icons">clear</button>
                        </form>
                        <form
                            onSubmit={(ev) => {
                                ev.preventDefault()
                                // console.log(ev.currentTarget.name.value)
                                query(
                                    `UPDATE user SET name = "${ev.currentTarget.name.value}" WHERE id = 3`
                                )
                                queryClient.invalidateQueries({
                                    queryKey: queryKey,
                                })
                                const dialog =
                                    document.getElementById('edit-user-modal')
                                dialog.close()
                            }}
                        >
                            <input
                                type="text"
                                placeholder={data.name}
                                id="name"
                            />
                            <button
                                className="button-17"
                                style={{ margin: '0.5rem', padding: '0.5rem' }}
                                type="submit"
                            >
                                Breyta nafni
                            </button>
                        </form>
                    </dialog>
                </div>
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
                                        <dialog
                                            onClick={(ev) => {
                                                const dialog =
                                                    document.getElementById(
                                                        `delete-collection-${collection.id}-modal`
                                                    )
                                                if (ev.target === dialog) {
                                                    dialog.close()
                                                }
                                            }}
                                            className="delete-collection-modal"
                                            style={{ borderRadius: '10px' }}
                                            id={`delete-collection-${collection.id}-modal`}
                                        >
                                            <h3>
                                                Viltu eyða „{collection.name}“?
                                            </h3>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    justifyContent:
                                                        'space-evenly',
                                                }}
                                            >
                                                <button
                                                    className="button-17"
                                                    onClick={() =>
                                                        handleDeleteCollection(
                                                            collection.id
                                                        )
                                                    }
                                                >
                                                    <span
                                                        className="material-icons"
                                                        style={{ color: 'red' }}
                                                    >
                                                        delete
                                                    </span>
                                                </button>
                                                <form method="dialog">
                                                    <button className="button-17">
                                                        <span className="material-icons">
                                                            undo
                                                        </span>
                                                    </button>
                                                </form>
                                            </div>
                                        </dialog>
                                        <button
                                            className="button-17"
                                            style={{
                                                display: 'flex',
                                                alignContent: 'center',
                                                justifyContent: 'center',
                                                borderRadius: '10px',
                                            }}
                                            onClick={() => {
                                                const deleteCollectionModal =
                                                    document.getElementById(
                                                        `delete-collection-${collection.id}-modal`
                                                    ) as HTMLDialogElement
                                                deleteCollectionModal!.showModal()
                                            }}
                                        >
                                            <span
                                                className="material-icons"
                                                style={
                                                    {
                                                        // color: 'var(--accent-color)',
                                                    }
                                                }
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
                {false && (
                    <>
                        <hr />
                        <h2>Sjálfgefin táknasöfn</h2>
                        <ul style={{ padding: 0 }}>
                            {defaultCollections?.map((collection, idx) => {
                                return (
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
                                                defaultCollections.length - 1
                                                    ? '1px dotted gray'
                                                    : undefined,
                                        }}
                                    >
                                        <span
                                            style={{
                                                display: 'flex',
                                                flexGrow: 1,
                                                justifyContent: 'space-between',
                                            }}
                                        >
                                            <div>{collection.name}</div>
                                            {/* <div>{collection[key]}</div> */}
                                        </span>

                                        <button
                                            className="button-17"
                                            style={{
                                                display: 'flex',
                                                alignContent: 'center',
                                                justifyContent: 'center',
                                                borderRadius: '10px',
                                            }}
                                            onClick={() => {
                                                createCollectionFromJson(
                                                    collection
                                                )
                                                // const deleteCollectionModal =
                                                //     document.getElementById(
                                                //         `delete-collection-${collection.id}-modal`
                                                //     ) as HTMLDialogElement
                                                // deleteCollectionModal!.showModal()
                                            }}
                                        >
                                            <span
                                                className="material-icons"
                                                style={
                                                    {
                                                        // color: 'var(--accent-color)',
                                                    }
                                                }
                                            >
                                                bookmark
                                            </span>
                                            <span
                                                style={{
                                                    alignSelf: 'center',
                                                }}
                                            >
                                                Vista
                                            </span>
                                        </button>
                                    </li>
                                )
                            })}
                        </ul>
                    </>
                )}
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
                        className="button-17"
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
                <button
                    className="button-17"
                    onClick={() => {
                        exportDB().then((db) => {
                            const link = document.createElement('a')
                            link.style.display = 'none'
                            document.body.appendChild(link)

                            const blob = new Blob([db], { type: 'text/plain' })
                            const objectURL = URL.createObjectURL(blob)

                            link.href = objectURL
                            link.href = URL.createObjectURL(blob)
                            link.download = 'db.sqlite3'
                            link.click()
                        })
                    }}
                >
                    Vista mín gögn sem sqlite3 gagnasafn.
                </button>
            </div>
            <Footer/>
        </>
    )
}
