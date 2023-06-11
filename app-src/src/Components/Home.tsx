import { useContext, useEffect, useState } from 'react'
import { Header } from './Header'
import './Home.css'
import { ThemeContext } from './ThemeContext'
import { Footer } from './Footer'
export function HomePage() {
    const currentTheme = useContext(ThemeContext)
    const [img, setImg] = useState(
        '/assets/images/manifest-icon-512.maskable.png'
    )
    useEffect(() => {
        setImg(
            currentTheme == 'light'
                ? '/assets/images/manifest-icon-512.maskable.png'
                : '/assets/images/manifest-icon-dark-512.maskable.png'
        )
    }, [currentTheme])
    console.log(currentTheme)

    return (
        <div>
            <Header />
            <div className="home">
                <div key={currentTheme}>
                    <img src={img} alt="" />
                </div>
                <div style={{ display: 'flex' }}>
                    <div className="card">lol</div>
                    <div className="card">nett</div>
                    <div className="card">yo</div>
                    <div className="card">what</div>
                </div>
            </div>
            <Footer/>
        </div>
    )
}

export default HomePage
