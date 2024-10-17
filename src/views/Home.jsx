import './Home.css'

export const Home = () => {
    return (
        <div className='home-container'>
            <div className='welcome'>
            <img src='/assets/icons/Galvadia Banner.png' className='welcome-banner'/>
                <h1>Welcome To The The Galvadian Armory!</h1>
                <p>The armory is an interactive website that allows you to create a character sheet for your in-game Galvadia
                characters.</p>
            </div>
        </div>
    )
}