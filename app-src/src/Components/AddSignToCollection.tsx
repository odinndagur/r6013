import { Listbox } from '@headlessui/react'
import { addSignToCollection, createCollection } from '../db'
import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-location'
export function AddSignToCollection({
    id,
    sign,
    collections,
    zIndex,
    centered
}: {
    id: number
    sign: any
    collections: { id: number; name: string }[]
    zIndex?: number
    centered?:boolean
}) {
    const [updateKey, setUpdateKey] = useState(0)
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    // const [icon, setIcon] = useState('add')
    const [icons, setIcons] = useState(Object.fromEntries(collections.map(collection => {
        return [collection.id, sign.collections.includes(collection.id) ? 'check' : 'add']
    })))
    // console.log(icons)
    return (
                <Listbox multiple>
                        <Listbox.Button
                            style={{
                                maxWidth: '2rem',
                            }}
                        >
                            <span className="material-icons">add</span>
                        </Listbox.Button>
                        <Listbox.Options
                        as={'ul'}
                            style={{
                                padding:0,
                                margin:0,
                                position: 'absolute',
                                width: '10rem',
                                transform: !centered ? 'translateX(-100%)' : 'translate(5rem,60%)',
                                zIndex: 9999,
                                cursor: 'pointer',
                                // backgroundColor:'brown'
                            }}
                        >
                            {collections
                                .filter((collection) => collection.id != 1)
                                .map((collection, collectionIdx) => (
                                    <Listbox.Option
                                    as='button'
                                        key={collection.id}
                                        style={{
                                        //     position: 'relative',
                                            width: '100%',
                                        //     textAlign: 'center',
                                        //     backgroundColor:
                                        //         'var(--background-color)',

                                            borderBottom:
                                                collectionIdx !=
                                                collections.length - 2
                                                    ? '1px solid gray'
                                                    : undefined,
                                            padding: '0.8rem 0.8rem',
                                        //     outline:
                                        //         '1px solid var(--main-text-color)',
                                        //     boxShadow: 'var(--card-box-shadow)',
                                        }}
                                        value={updateKey}
                                        onClick={() => {
                                            // setIcon('rotate_right')
                                            const currentId = collection.id
                                            setIcons((old) => {
                                                old[currentId] = 'rotate_right'
                                                return old
                                            })
                                            addSignToCollection({
                                                signId: id,
                                                collectionId: collection.id,
                                            }).then((res) => {
                                                if (res.status == 'OK') {
                                                    setIcons((old) => {
                                                        old[currentId] = 'check'
                                                        return old
                                                    })
                                                    setUpdateKey((old) => old+1)
                                                    // setIcon('check')
                                                    // setTimeout(() => {
                                                    //     setIcon('add')
                                                    // }, 5000)
                                                } else {
                                                    setIcons((old) => {
                                                        old[currentId] = 'error'
                                                        return old
                                                    })

                                                    // setIcon('error')
                                                }
                                            })
                                            queryClient.invalidateQueries(['signs'])
                                        }}
                                    >
                                        {({ selected, active }) => (
                                            <div key={collection.id}
                                            style={{display:'flex',justifyContent:'space-between', alignItems:'center',width:'100%'}}
                                            >
                                                <span>
                                                    {collection.name}{' '}
                                                </span>
                                                    <span key={icons[collection.id]} className="material-icons">
                                                        {icons[collection.id]}

                                                        {/* {icon} */}
                                                        
                                                    </span>
                                            </div>
                                        )}
                                    </Listbox.Option>
                                ))}
                            {/* <Listbox.Option value={'lol'}>
                                {({ selected }) => (
                                    <>
                                        <span
                                            onClick={() => {
                                                const el =
                                                    document.getElementById(
                                                        'new-collection-modal'
                                                    )
                                                el!.showModal()
                                            }}
                                        >
                                            Nýtt táknasafn
                                        </span>
                                    </>
                                )}
                            </Listbox.Option> */}
                        </Listbox.Options>
                </Listbox>
            // <dialog
            //     style={{ border: '1px solid black', borderRadius: '10px' }}
            //     onClick={(ev) => {
            //         const dialog = document.getElementById(
            //             'new-collection-modal'
            //         ) as HTMLDialogElement
            //         if (ev.target == dialog) {
            //             dialog.close()
            //         }
            //     }}
            //     id="new-collection-modal"
            // >
            //     <form method="dialog">
            //         <button>x</button>
            //     </form>
            //     <h3>Nýtt táknasafn</h3>
            //     <form
            //         onSubmit={(ev) => {
            //             createCollection({
            //                 userId: 3,
            //                 collectionName: ev.currentTarget.name.value,
            //             })
            //             navigate({ search: (old) => ({ ...old }) })

            //             // queryClient.invalidateQueries()
            //             // queryClient.invalidateQueries({
            //             //     queryKey: ['user'],
            //             // })
            //             // ev.preventDefault()
            //             // console.log('form!', ev.currentTarget.name.value)
            //         }}
            //     >
            //         <input
            //             type="text"
            //             name="name"
            //             id="name"
            //             placeholder="Nafn"
            //         />
            //         <button type="submit">Staðfesta</button>
            //     </form>
            // </dialog>
    )
}
