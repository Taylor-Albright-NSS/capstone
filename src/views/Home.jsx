import './Home.css'

export const Home = () => {
    return (
        <div className='home-container'>
            <div className='welcome'>
            <img src='/assets/icons/Galvadia Banner.png' className='welcome-banner'/>
                <h1>Welcome To The The Galvadian Armory!</h1>
                <p>The Armory is an interactive application that lets you create a character sheet to reflect your in-game character, so you can test out various weapons as well as alter your stats to see how those changes affect your damage output.</p>
            </div>
        </div>
    )
}