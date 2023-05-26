import { Listbox } from '@headlessui/react'
import { Link, useNavigate } from '@tanstack/react-location'

const arrayRange = (start: number, stop: number, step: number) =>
    Array.from(
        { length: (stop - start) / step + 1 },
        (value, index) => start + index * step
    )

export function SelectPage({
    totalPages,
    updatePage,
}: {
    totalPages: number
    updatePage: any
}) {
    const navigate = useNavigate()
    const pages = arrayRange(1, totalPages, 1)
    return (
        <div>
            <Listbox>
                <Listbox.Button
                    className=""
                    as="a"
                    style={{ cursor: 'pointer', textDecoration: 'none' }}
                >
                    ...
                </Listbox.Button>
                {/* <Listbox.Label>Velja táknasafn</Listbox.Label> */}
                <Listbox.Options
                    style={{
                        position: 'absolute',
                        width: 'fit-content',
                        margin: 'auto',
                        overflow: 'scroll',
                        maxHeight: '10rem',
                        // left: 0,
                        // right: 0,
                        padding: 0,
                        textAlign: 'center',
                        cursor: 'pointer',
                        // borderRadius: '10px',
                    }}
                >
                    {pages.map((page, idx: number) => (
                        <Listbox.Option
                            key={page}
                            style={{
                                position: 'relative',
                                textAlign: 'center',
                                backgroundColor: 'var(--background-color)',
                                borderBottom:
                                    idx != pages.length - 1
                                        ? '1px solid gray'
                                        : undefined,
                                padding: '0.8rem 0.8rem',
                                boxShadow: 'var(--card-box-shadow)',
                            }}
                            value={page}
                            onClick={() => {
                                updatePage(page)
                            }}
                        >
                            {({ selected }) => (
                                <>
                                    <span>{page}</span>
                                </>
                            )}
                        </Listbox.Option>
                    ))}
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
