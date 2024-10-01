import { Route, Routes, Outlet } from "react-router-dom"
import { Navbar } from "../components/navbar/Navbar"
import { ProfileView } from "./ProfileView"
import { CharacterBuilderView } from "./CharacterBuilderView"
import { useState, useEffect } from "react"


export const ApplicationViews = () => {
    const [currentUser, setCurrentUser] = useState({})
    const [selectedCharacterId, setSelectedCharacterId] = useState(0)
    const [character, setCharacter] = useState({})
    const [characterCopy, setCharacterCopy] = useState({})
    const [equippedItems, setEquippedItems] = useState([])
    const [equippedItemsCopy, setEquippedItemsCopy] = useState({})
    const [classStats, setClassStats] = useState({baseStr: 0, baseDex: 0, baseAgi: 0})
    const [raceStats, setRaceStats] = useState({baseStr: 0, baseDex: 0, baseAgi: 0})

    useEffect(() => {
        const currentUserObj = localStorage.getItem('capstone_user')
        const parsedCurrentUser = JSON.parse(currentUserObj)
        const currentUserId = parseInt(parsedCurrentUser.id)
        setCurrentUser(currentUserId)
        console.log(selectedCharacterId, ' selected character ID should be 0')
        }, [])

    return (
        <Routes>
            <Route path="/" element={
                <>
                    <Navbar />
                    <Outlet/>
                </>
                }>
                <Route path='profile' element={<ProfileView 
                                                currentUser={currentUser} 
                                                selectedCharacterId={selectedCharacterId}
                                                setSelectedCharacterId={setSelectedCharacterId}
                                                classStats={classStats}
                                                setClassStats={setClassStats}
                                                raceStats={raceStats}
                                                setRaceStats={setRaceStats}
                                                character={character}
                                                setCharacter={setCharacter}
                                                characterCopy={characterCopy}
                                                setCharacterCopy={setCharacterCopy}
                                                equippedItems={equippedItems}
                                                setEquippedItems={setEquippedItems}
                                                equippedItemsCopy={equippedItemsCopy}
                                                setEquippedItemsCopy={setEquippedItemsCopy}
                                                />} 
                                                />
                <Route path='characterbuilder' element={<CharacterBuilderView 
                                                currentUser={currentUser}
                                                selectedCharacterId={selectedCharacterId}
                                                setSelectedCharacterId={setSelectedCharacterId}
                                                classStats={classStats}
                                                setClassStats={setClassStats}
                                                raceStats={raceStats}
                                                setRaceStats={setRaceStats}
                                                character={character}
                                                setCharacter={setCharacter}
                                                characterCopy={characterCopy}
                                                setCharacterCopy={setCharacterCopy}
                                                equippedItems={equippedItems}
                                                setEquippedItems={setEquippedItems}
                                                equippedItemsCopy={equippedItemsCopy}
                                                setEquippedItemsCopy={setEquippedItemsCopy}
                                                />} 
                                                />
            </Route>
        </Routes>
    )  
}

