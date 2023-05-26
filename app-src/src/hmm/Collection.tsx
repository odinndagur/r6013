import { Link } from 'react-router-dom'
import { useState } from 'react'
import {
    addSignToCollection,
    checkSignInCollection,
    deleteSignFromCollection,
} from '../db'
import '../style.css'

function Collection({ sign }: { sign: Sign }) {
    const [inCollection, setInCollection] = useState(
        Boolean(sign.in_collection)
    )
    const toggleUserCollection = async () => {
        const collection_id = 3
        const sign_id = sign.sign_id
        const exists = await checkSignInCollection({
            sign_id: sign_id,
            collection_id: collection_id,
        })
        setInCollection(!exists)
        if (exists) {
            deleteSignFromCollection({
                signId: sign_id,
                collectionId: collection_id,
            })
            setInCollection(false)
        } else {
            addSignToCollection({
                signId: sign_id,
                collectionId: collection_id,
            })
            setInCollection(true)
        }
    }

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0 2rem',
            }}
        >
            <div>
                <button onClick={toggleUserCollection} className="round-button">
                    {!inCollection ? (
                        <span className="material-icons">add</span>
                    ) : (
                        <span className="material-icons">remove</span>
                    )}
                </button>
            </div>
            <Link to={`/signs/${sign.sign_id}`} style={{ paddingLeft: '2rem' }}>
                {sign.phrase}
            </Link>
        </div>
    )
}

export default Collection
