import { Link, useNavigate } from '@tanstack/react-location'
import { AddSignToCollection } from './AddSignToCollection'
import { deleteSignFromCollection } from '../db'
import { useQueryClient } from '@tanstack/react-query'

export function SignCollectionItem({
    sign,
    user,
    currentCollection,
    queryKey,
    editing,
}) {
    const queryClient = useQueryClient()

    return (
        <div
            draggable
            style={{
                margin: 'auto',
                // width: '100vw',
                // backgroundColor: 'red',
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0 1rem',
                alignItems: 'center',
                boxShadow: 'var(--card-box-shadow)',
                borderRadius: '3px',
                // boxSizing: 'border-box',
            }}
            className=""
            key={sign.sign_id}
        >
            <Link
                draggable
                className=""
                to={`/signs/${sign.sign_id}`}
                search={(search) => ({
                    lastSearch: {
                        ...search,
                    },
                    scroll: 0,
                })}
                style={{
                    // border: '1px solid red',
                    // minHeight: '2rem',
                    height: '100%',
                    padding: '1rem',
                    flexGrow: 1,
                }}
            >
                {/* <div
            className=""
            style={{
                border: '1px solid red',
                flexGrow: 1,
            }}
        > */}
                <b>{sign.phrase}</b>
                <div>
                    <i>
                        {sign.related_signs
                            ? sign.related_signs.split(',').join(', ')
                            : sign.related_signs}
                    </i>
                </div>
                {/* <p>{sign.levenshtein}</p>
                <p>{sign.levenshtein_sign_phrase}</p>
                <p>{sign.levenshtein_search_value}</p> */}
                {/* </div> */}
            </Link>
            <div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <AddSignToCollection
                        id={sign.sign_id}
                        sign={sign}
                        collections={user.collections}
                    />

                    {editing && (
                        <button
                            className=""
                            style={{
                                // zIndex: 3,
                                // borderRadius: '10px',
                                backgroundColor: 'rgba(255,0,0,0.8)',
                                maxWidth: '2rem',
                            }}
                            onClick={() => {
                                console.log('deleting sign')
                                deleteSignFromCollection({
                                    signId: sign.sign_id,
                                    collectionId: currentCollection,
                                })
                                queryClient.invalidateQueries()
                            }}
                        >
                            <span className="material-icons">remove</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
