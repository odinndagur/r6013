import {
    Link,
    useMatch,
    useMatchRoute,
    useRouter,
} from '@tanstack/react-location'
import { Menu, Transition } from '@headlessui/react'
import './AppNavBar.css'
import { StyleHTMLAttributes } from 'react'

function NavItem({
    route,
    icon,
    name,
    type,
    style,
    className,
    search,
}: {
    route: string
    icon: string
    name: string
    type: 'footer' | 'header'
    style?: any
    className?: string
    search?: any
}) {
    return (
        <Link
            className={className + ' nav-item nav-item-' + type}
            to={route}
            style={style}
            getActiveProps={() => ({
                style: {
                    ...style,
                    fontWeight: 'bold',
                    color: 'black',
                    // color: 'var(--background-color)',
                },
            })}
            search={(old) => ({ ...search, scroll: 0 })}
        >
            <div className="material-symbols-outlined">{icon}</div>
            <div className="nav-text">{name}</div>
        </Link>
    )
}

export function AppNavBar({ type }: { type: 'footer' | 'header' }) {
    const navItems = [
        // { route: '/home', icon: 'home', name: 'Heim', type: type },
        {
            route: '/collection',
            icon: 'sign_language',
            name: 'Öll tákn',
            type: type,
            search: { id: 1 },
        },
        //        {
        //            route: '/leit',
        //            icon: 'search',
        //            name: 'Leit',
        //            type: type,
        //        },
        {
            route: '/settings',
            icon: 'account_box',
            name: 'Táknasöfn',
            type: type,
        },
        {
            route: '/random',
            icon: 'shuffle',
            name: 'Tákn af handahófi',
            type: type,
        },
    ]

    const currentPathName = useMatch().pathname
    const basePath = useRouter().basepath
    let currentRouteName = 'Fara'
    for (let route of navItems) {
        // console.log(basePath, currentPathName)
        if (
            currentPathName.replace(basePath!, '').replaceAll('/', '') ==
            route.route.replaceAll('/', '')
        ) {
            currentRouteName = route.name
            // console.log(route)
        } else {
            // currentRouteName = currentPathName
            //     .replace(basePath!, '')
            //     .replaceAll('/', '')
        }
    }
    return (
        <div className="nav-container">
            {type == 'header' && (
                <Menu
                    as={'div'}
                    style={{}}
                    className="relative inline-block text-left small-menu"
                >
                    <Menu.Button
                        style={{
                            padding: '0.5rem',
                            borderRadius: '10px',
                            margin: '0.5rem',
                            minBlockSize: '1.3rem',
                            color: 'var(--main-text-color)',
                        }}
                        className="inline-flex w-full justify-center rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                    >
                        {currentRouteName}
                    </Menu.Button>
                    <Menu.Items
                        style={{
                            // position: 'absolute',
                            backgroundColor: 'var(--accent-color)',
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-evenly',
                            alignContent: 'center',
                            width: '100%',
                            top: 0,
                            // left: '-100%',
                            margin: 'auto',
                            // marginTop: '2rem',
                            // width: '100%',
                            // outline: '1px solid red',
                        }}
                        className="absolute mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                    >
                        {navItems.map((item) => {
                            return (
                                <Menu.Item as="div" key={item.name}>
                                    {({ active }) => (
                                        <NavItem
                                            {...item}
                                            style={{
                                                display: 'flex',
                                                width: 'max-content',
                                                textAlign: 'center',
                                                margin: 'auto',
                                                backgroundColor:
                                                    'var(--accent-color)',
                                                padding: '0.2rem 0.5rem',
                                                flexBasis: '100%',
                                            }}
                                            className={`${
                                                active
                                                    ? 'bg-violet-500 text-white'
                                                    : 'text-gray-900'
                                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                        />
                                    )}
                                </Menu.Item>
                            )
                        })}
                    </Menu.Items>
                </Menu>
            )}
            <nav
                className={type === 'footer' ? 'app-navbar' : 'desktop-navbar'}
            >
                {navItems.map((item) => {
                    return <NavItem {...item} key={item.name} />
                })}
            </nav>
        </div>
    )
}
