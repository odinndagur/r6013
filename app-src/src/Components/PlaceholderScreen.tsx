import { useContext, useEffect, useState } from 'react'
import { ThemeContext } from './ThemeContext'

function PlaceholderScreen() {
    const currentTheme = useContext(ThemeContext)
    const [img, setImg] = useState(
        '/r6013/assets/images/manifest-icon-512.maskable.png'
    )
    useEffect(() => {
        setImg(
            currentTheme == 'light'
                ? '/r6013/assets/images/manifest-icon-512.maskable.png'
                : '/r6013/assets/images/manifest-icon-dark-512.maskable.png'
        )
    }, [currentTheme])
    return (
        <div className="placeholder-image-container">
            <img className="placeholder-image" src={img} />
        </div>
    )
}

export default PlaceholderScreen
