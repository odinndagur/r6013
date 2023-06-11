import { Listbox } from '@headlessui/react'
import { Link, useNavigate } from '@tanstack/react-location'

export function SelectCollection({ currentCollection, collections }) {
    const navigate = useNavigate()
    return (
        <div style={{ zIndex: 50 }}>
            <Listbox value={currentCollection}>
                <Listbox.Button
                    className=""
                    as="div"
                    style={{ cursor: 'pointer', textDecoration: 'underline' }}
                >
                    {currentCollection && <h3>{currentCollection}</h3>}
                </Listbox.Button>
                {/* <Listbox.Label>Velja táknasafn</Listbox.Label> */}
                <Listbox.Options
                    style={{
                        // position: 'absolute',
                        width: 'fit-content',
                        margin: 'auto',
                        left: 0,
                        right: 0,
                        padding: 0,
                        textAlign: 'center',
                        cursor: 'pointer',
                        outline: '1px solid var(--main-text-color)',
                        // borderRadius: '10px',
                    }}
                >
                    {collections.map(
                        (
                            collection: { id: string; name: string },
                            idx: number
                        ) => (
                            <Listbox.Option
                                key={collection.id}
                                style={{
                                    position: 'relative',
                                    textAlign: 'center',
                                    backgroundColor: 'var(--background-color)',
                                    borderBottom:
                                        idx != collections.length - 1
                                            ? '1px solid gray'
                                            : undefined,
                                    padding: '0.8rem 0.8rem',
                                    boxShadow: 'var(--card-box-shadow)',
                                }}
                                value={collection.id}
                                onClick={() => {
                                    navigate({
                                        search: (search) => ({
                                            ...search,
                                            query: '',
                                            id: collection.id,
                                            scroll: 0,
                                            page: 1,
                                        }),
                                    })
                                }}
                            >
                                {({ selected }) => (
                                    <>
                                        <span>{collection.name}</span>
                                    </>
                                )}
                            </Listbox.Option>
                        )
                    )}
                </Listbox.Options>
                {/* </Transition> */}
            </Listbox>
        </div>
    )
}

{
    /* <div>
collections to select
{currentCollection && <h1>{currentCollection}</h1>}
{collections?.map((collection) => {
    return (
        <Link
            to={`/collection`}
            search={(search) => ({
                // lastSearch: {
                //     ...search,
                // },
                scroll: 0,
                id: collection.id,
            })}
        >
            {collection.name}
        </Link>
    )
})}
</div> */
}
