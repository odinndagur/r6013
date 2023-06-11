import { Link, useNavigate, useSearch } from '@tanstack/react-location'
import { useQuery } from '@tanstack/react-query'
import { listHandforms, listSignDetails } from '../db'
import { ChangeEvent, useEffect, useState } from 'react'
import './signpage.css'
import './SignFilter.css'
import { MyLocationGenerics } from './Generics'

export function SignFilter() {
    const [showFilters, setShowFilters] = useState(false)
    type signDetailsType = Awaited<ReturnType<typeof listSignDetails>>
    const [signDetails, setSignDetails] = useState<signDetailsType>()
    const [selectedSignDetails, setSelectedSignDetails] =
        useState<signDetailsType>()
    const [loaded, setLoaded] = useState(false)
    useEffect(() => {
        // listHandforms().then(setHandforms)
        listSignDetails().then(setSignDetails)
        setLoaded(true)
    }, [])

    const navigate = useNavigate()
    const search = useSearch()

    const filtersWithAccents = {
        handform: 'Handform',
        ordflokkur: 'Orðflokkur',
        efnisflokkur: 'Efnisflokkur',
        myndunarstadur: 'Myndunarstaður',
    }

    const filtersDetailText = Object.keys(filtersWithAccents)
        .map((key) => {
            return search[key]?.length ? filtersWithAccents[key] : undefined
        })
        .filter((val) => val?.length)
        .join(', ')

    function changeDetail(
        ev: ChangeEvent<HTMLSelectElement>,
        {
            kind,
        }: {
            kind: 'handform' | 'ordflokkur' | 'efnisflokkur' | 'myndunarstadur'
        }
    ) {
        console.log(kind)
        const currentOptions = Array.from(ev.target)
            .map((option) => {
                if (option.selected) {
                    return option.value
                }
                return null
            })
            .filter((temp) => temp != null && temp != '')
        if (!currentOptions) {
            navigate({ search: (old) => ({ ...old }) })
            return
        }
        if (kind == 'ordflokkur') {
            navigate({
                search: (old) => ({
                    ...old,
                    ordflokkur: currentOptions.length
                        ? currentOptions
                        : undefined,
                }),
            })
        }
        if (kind == 'efnisflokkur') {
            navigate({
                search: (old) => ({
                    ...old,
                    efnisflokkur: currentOptions.length
                        ? currentOptions
                        : undefined,
                }),
            })
        }
        if (kind == 'myndunarstadur') {
            navigate({
                search: (old) => ({
                    ...old,
                    myndunarstadur: currentOptions.length
                        ? currentOptions
                        : undefined,
                }),
            })
        }
        if (kind == 'handform') {
            navigate({
                search: (old) => ({
                    ...old,
                    // page: 1,
                    handform: currentOptions.length
                        ? currentOptions
                        : undefined,
                }),
            })
        }
    }

    // function changeHandform(ev) {
    //     console.log(ev)
    //     const selectedHandforms = Array.from(ev.target)
    //         .map((option) => {
    //             if (option.selected) {
    //                 return option.value
    //             }
    //             return null
    //         })
    //         .filter((temp) => temp != null)
    //     navigate({
    //         search: (old) => ({
    //             ...old,
    //             signDetails: {
    //                 ...old.signDetails,
    //                 handform: selectedHandforms,
    //             },
    //         }),
    //     })
    // }

    if (!loaded) {
        return null
    }
    return (
        <div>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    // alignContent: 'center',
                }}
            >
                <button
                    className="button-17"
                    style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '10px',
                        height: '2rem',
                        fontStyle: filtersDetailText && 'italic',
                    }}
                    onClick={() => {
                        const filterModal = document.getElementById(
                            'filter-modal'
                        ) as HTMLDialogElement
                        filterModal!.showModal()
                    }}
                >
                    Síur
                    {filtersDetailText && (
                        <i className="sign-filter-details">
                            {' '}
                            ({filtersDetailText})
                        </i>
                    )}
                </button>
            </div>
            <dialog
                onClick={(ev) => {
                    const dialog = document.getElementById(
                        'filter-modal'
                    ) as HTMLDialogElement
                    if (ev.target == dialog) {
                        dialog.close()
                    }
                }}
                id="filter-modal"
                // className="sign-info"
            >
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        alignContent: 'center',
                    }}
                >
                    <form method="dialog">
                        <button className="">
                            <span className="material-icons">clear</span>
                        </button>
                    </form>
                    {filtersDetailText && (
                        <Link
                            onClick={() => {}}
                            search={(old) => ({
                                ...old,
                                page: 1,
                                handform: undefined,
                                ordflokkur: undefined,
                                efnisflokkur: undefined,
                                myndunarstadur: undefined,
                            })}
                        >
                            <span>Hreinsa allar síur</span>
                            <span className="material-icons">delete</span>
                        </Link>
                    )}
                </div>

                <div className="sign-info">
                    {/* <div>{JSON.stringify(signDetails)}</div> */}
                    <br />
                    <label htmlFor="">
                        <b>Handform</b>
                        {search.handform?.length && (
                            <Link
                                search={(old) => ({
                                    ...old,
                                    page: 1,
                                    handform: undefined,
                                })}
                                className="material-icons"
                            >
                                delete
                            </Link>
                        )}
                        {search.handform && (
                            <>
                                <br />
                                <div style={{ maxWidth: '100%' }}>
                                    {search.handform.join(', ')}
                                </div>
                            </>
                        )}
                        <br />
                        <br />
                        <select
                            className="sign-info-item"
                            multiple
                            value={search.handform ?? []}
                            onChange={(ev) =>
                                changeDetail(ev, { kind: 'handform' })
                            }
                            // defaultValue={'lol'}
                            // onChange={(ev) => changeHandform(ev)}
                        >
                            <option value="Handform" disabled>
                                Handform
                            </option>

                            {signDetails?.handform?.map((hf) => {
                                return (
                                    <option
                                        // selected={search.handform?.includes(hf)}
                                        key={hf}
                                        value={hf}
                                    >
                                        {hf}
                                    </option>
                                )
                            })}
                        </select>
                    </label>
                    <br />

                    <label htmlFor="">
                        <b>Orðflokkur</b>
                        {search.ordflokkur?.length && (
                            <Link
                                search={(old) => ({
                                    ...old,
                                    page: 1,
                                    ordflokkur: undefined,
                                })}
                                className="material-icons"
                            >
                                delete
                            </Link>
                        )}
                        {search.ordflokkur && (
                            <>
                                <br />
                                <div style={{ maxWidth: '100%' }}>
                                    {search.ordflokkur.join(', ')}
                                </div>
                            </>
                        )}
                        <br />
                        <br />
                        <select
                            className="sign-info-item"
                            multiple
                            value={search.ordflokkur ?? []}
                            onChange={(ev) =>
                                changeDetail(ev, { kind: 'ordflokkur' })
                            }
                        >
                            <option value="Orðflokkur" disabled>
                                Orðflokkur
                            </option>

                            {signDetails?.ordflokkur?.map((ordfl) => {
                                return (
                                    <option
                                        // selected={search.ordflokkur?.includes(
                                        //     ordfl
                                        // )}
                                        key={ordfl}
                                        value={ordfl}
                                    >
                                        {ordfl}
                                    </option>
                                )
                            })}
                        </select>
                    </label>
                    <br />
                    <label htmlFor="">
                        <b>Efnisflokkur</b>
                        {search.efnisflokkur?.length && (
                            <Link
                                search={(old) => ({
                                    ...old,
                                    page: 1,
                                    efnisflokkur: undefined,
                                })}
                                className="material-icons"
                            >
                                delete
                            </Link>
                        )}
                        {search.efnisflokkur && (
                            <>
                                <br />
                                <div style={{ maxWidth: '100%' }}>
                                    {search.efnisflokkur.join(', ')}
                                </div>
                            </>
                        )}{' '}
                        <br />
                        <br />
                        <select
                            className="sign-info-item"
                            multiple
                            value={search.efnisflokkur ?? []}
                            onChange={(ev) =>
                                changeDetail(ev, { kind: 'efnisflokkur' })
                            }
                        >
                            <option value="Efnisflokkur" disabled>
                                Efnisflokkur
                            </option>

                            {signDetails?.efnisflokkur?.map((efnisfl) => {
                                return (
                                    <option
                                        // selected={search.efnisflokkur?.includes(
                                        //     efnisfl
                                        // )}
                                        key={efnisfl}
                                        value={efnisfl}
                                    >
                                        {efnisfl}
                                    </option>
                                )
                            })}
                        </select>
                    </label>
                    <label htmlFor="">
                        <br />
                        <b>Myndunarstaður</b>
                        {search.myndunarstadur?.length && (
                            <Link
                                search={(old) => ({
                                    ...old,
                                    page: 1,
                                    myndunarstadur: undefined,
                                })}
                                className="material-icons"
                            >
                                delete
                            </Link>
                        )}
                        {search.myndunarstadur && (
                            <>
                                <br />
                                <div style={{ maxWidth: '100%' }}>
                                    {search.myndunarstadur.join(', ')}
                                </div>
                            </>
                        )}{' '}
                        <br />
                        <br />
                        <select
                            className="sign-info-item"
                            multiple
                            value={search.myndunarstadur ?? []}
                            onChange={(ev) =>
                                changeDetail(ev, { kind: 'myndunarstadur' })
                            }
                        >
                            <option value="Myndunarstaður" disabled>
                                Myndunarstaður
                            </option>

                            {signDetails?.myndunarstadur?.map((mf) => {
                                return (
                                    <option
                                        // selected={search.myndunarstadur?.includes(
                                        //     mf
                                        // )}
                                        key={mf}
                                        value={mf}
                                    >
                                        {mf}
                                    </option>
                                )
                            })}
                        </select>
                    </label>
                </div>
            </dialog>
        </div>
    )
}
