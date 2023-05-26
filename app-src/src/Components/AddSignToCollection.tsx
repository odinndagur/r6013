import { Listbox } from '@headlessui/react'
import { addSignToCollection } from '../db'
import { useState } from 'react'
export function AddSignToCollection({
    id,
    collections,
    zIndex,
}: {
    id: number
    collections: { id: number; name: string }[]
    zIndex?: number
}) {
    const [icon, setIcon] = useState('add')
    return (
        <div style={{ zIndex: zIndex ?? undefined }}>
            <div className="">
                <Listbox value={'nett'}>
                    <div className="">
                        <Listbox.Button
                            className="button-17"
                            style={{
                                // borderRadius: '10px',
                                backgroundColor: 'var(--secondary-color)',
                                maxWidth: '2rem',
                            }}
                            onClick={(ev) => {
                                // ev.stopPropagation()
                                // return null
                            }}
                        >
                            <span className="material-icons">{icon}</span>
                        </Listbox.Button>
                        {/* <Transition
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        > */}
                        <Listbox.Options
                            style={{
                                position: 'absolute',
                                width: 'fit-content',
                                transform: 'translateX(-100%)',
                                zIndex: 9999,

                                // flexDirection: 'column',
                                // alignSelf: 'center',
                                // padding: '0 1rem 0 0',
                                // marginRight: '1rem',
                                // maxHeight: '40vh',
                                // overflowY: 'scroll',
                                // right: 0,
                                // backgroundColor: 'var(--background-color)',
                                // backgroundColor: 'blue',
                                cursor: 'pointer',
                            }}
                            // className="absolute max-h-60 overflow-auto rounded-md bg-white divide-y"
                        >
                            {collections
                                .filter((collection) => collection.id != 1)
                                .map((collection, collectionIdx) => (
                                    <Listbox.Option
                                        key={collection.id}
                                        style={{
                                            position: 'relative',
                                            // backgroundColor: 'red',
                                            width: '100%',

                                            // right: '50%',
                                            textAlign: 'center',
                                            backgroundColor:
                                                'var(--background-color)',

                                            borderBottom:
                                                collectionIdx !=
                                                collections.length - 2
                                                    ? '1px solid gray'
                                                    : undefined,
                                            padding: '0.8rem 0.8rem',
                                            // borderRadius: '10px',
                                            outline:
                                                '1px solid var(--main-text-color)',
                                            boxShadow: 'var(--card-box-shadow)',
                                        }}
                                        value={collection.id}
                                        onClick={() => {
                                            setIcon('rotate_right')
                                            addSignToCollection({
                                                signId: id,
                                                collectionId: collection.id,
                                            }).then((res) => {
                                                if (res.status == 'OK') {
                                                    setIcon('check')
                                                } else {
                                                    setIcon('error')
                                                }
                                            })
                                        }}
                                    >
                                        {({ selected }) => (
                                            <>
                                                <span
                                                    onClick={() => {
                                                        addSignToCollection({
                                                            signId: id,
                                                            collectionId:
                                                                collection.id,
                                                        })
                                                        setIcon('check')
                                                    }}
                                                    className={`block truncate ${
                                                        selected
                                                            ? 'font-medium'
                                                            : 'font-normal'
                                                    }`}
                                                    style={
                                                        {
                                                            // backgroundColor: 'red',
                                                        }
                                                    }
                                                >
                                                    {collection.name}
                                                </span>
                                            </>
                                        )}
                                    </Listbox.Option>
                                ))}
                        </Listbox.Options>
                        {/* </Transition> */}
                    </div>
                </Listbox>
            </div>
        </div>
    )
}
