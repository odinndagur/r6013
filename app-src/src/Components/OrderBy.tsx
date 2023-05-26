import { Listbox } from '@headlessui/react'
import { Link, useNavigate, useSearch } from '@tanstack/react-location'
import { MakeGenerics } from '@tanstack/react-location'
import { useQueryClient } from '@tanstack/react-query'

type OrderByGenerics = MakeGenerics<{
    Search: {
        orderBy: {
            value?: string
            order?: string
        }
    }
}>
export function OrderBy() {
    const fontSize = '1.5rem'
    const searchParams = useSearch<OrderByGenerics>()
    const orderBy = searchParams.orderBy ?? {
        value: 'az',
        order: 'asc',
    }
    const setOrderBy = (value: 'az' | 'date') => {
        if (value == orderBy.value) {
            return {
                value: value,
                order: orderBy.order == 'asc' ? 'desc' : 'asc',
            }
        } else {
            return {
                value: orderBy.value == 'az' ? 'date' : 'az',
                order: 'asc',
            }
        }
    }
    return (
        <div style={{ display: 'flex' }}>
            {searchParams.id != 1 && (
                <Link
                    // onClick={() => setOrderBy('date')}
                    search={(old) => ({
                        ...old,
                        orderBy: setOrderBy('date'),
                        page: 1,
                    })}
                    style={{
                        cursor: 'pointer',
                        display: 'flex',
                        // alignContent: 'center',
                        // justifyContent: 'center',
                        alignItems: 'center',
                        // justifyItems: 'center',
                    }}
                >
                    <div
                        className="material-icons"
                        style={{
                            fontSize: fontSize,
                            padding: '0.5rem 0.5rem',
                            color:
                                orderBy.value == 'date'
                                    ? 'var(--main-text-color)'
                                    : 'gray',
                        }}
                    >
                        calendar_month
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span
                            className="material-icons"
                            style={{
                                fontSize: fontSize,

                                color:
                                    orderBy.value == 'date' &&
                                    orderBy.order == 'asc'
                                        ? 'var(--main-text-color)'
                                        : 'gray',
                            }}
                        >
                            keyboard_arrow_up
                        </span>
                        <span
                            className="material-icons"
                            style={{
                                fontSize: fontSize,

                                color:
                                    orderBy.value == 'date' &&
                                    orderBy.order == 'desc'
                                        ? 'var(--main-text-color)'
                                        : 'gray',
                            }}
                        >
                            keyboard_arrow_down
                        </span>
                    </div>
                </Link>
            )}

            <Link
                search={(old) => ({
                    ...old,
                    orderBy: setOrderBy('az'),
                    page: 1,
                })}
                style={{
                    cursor: 'pointer',
                    display: 'flex',
                    // alignContent: 'center',
                    // justifyContent: 'center',
                    alignItems: 'center',
                    // justifyItems: 'center',
                }}
            >
                <div
                    className="material-icons"
                    style={{
                        fontSize: fontSize,
                        padding: '0.5rem 0.5rem',
                        color:
                            orderBy.value == 'az'
                                ? 'var(--main-text-color)'
                                : 'gray',
                    }}
                >
                    sort_by_alpha
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span
                        className="material-icons"
                        style={{
                            fontSize: fontSize,

                            color:
                                orderBy.value == 'az' && orderBy.order == 'asc'
                                    ? 'var(--main-text-color)'
                                    : 'gray',
                        }}
                    >
                        keyboard_arrow_up
                    </span>
                    <span
                        className="material-icons"
                        style={{
                            fontSize: fontSize,

                            color:
                                orderBy.value == 'az' && orderBy.order == 'desc'
                                    ? 'var(--main-text-color)'
                                    : 'gray',
                        }}
                    >
                        keyboard_arrow_down
                    </span>
                </div>
            </Link>
        </div>
    )
}
