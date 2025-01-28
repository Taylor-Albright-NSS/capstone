import { Route, Routes, Outlet } from "react-router-dom"
import { Navbar } from "../components/navbar/Navbar"
import { ProfileView } from "./ProfileView"
import { CharacterBuilderView } from "./CharacterBuilderView"
import { useState, useEffect } from "react"
import { AllItemsView } from "./AllItemsView"
import { ItemDetails } from "../components/itemDetails/ItemDetails"
import { EditItem } from "../components/editItem/EditItem"
import { CreateItem } from "../components/createItem/CreateItem"
import { MyAccount } from "./MyAccount"
import { Home } from "./Home"

export const ApplicationViews = () => {
    const [currentUser, setCurrentUser] = useState({})
    const [selectedCharacterId, setSelectedCharacterId] = useState(0)
    const [character, setCharacter] = useState({})
    const [characterCopy, setCharacterCopy] = useState({})
    const [equippedItems, setEquippedItems] = useState([])
    const [equippedItemsCopy, setEquippedItemsCopy] = useState({})
    const [classStats, setClassStats] = useState({str: 0, dex: 0, agi: 0})
    const [classStatsCopy, setClassStatsCopy] = useState({str: 0, dex: 0, agi: 0})
    const [raceStats, setRaceStats] = useState({str: 0, dex: 0, agi: 0})
    const [raceStatsCopy, setRaceStatsCopy] = useState({str: 0, dex: 0, agi: 0})
    const [allItems, setAllItems] = useState([])


    useEffect(() => {
        const currentUserObj = localStorage.getItem('capstone_user')
        const parsedCurrentUser = JSON.parse(currentUserObj)
        const currentUserId = parseInt(parsedCurrentUser.id)
        setCurrentUser(currentUserId)
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
                                                classStatsCopy={classStatsCopy}
                                                setClassStatsCopy={setClassStatsCopy}
                                                raceStatsCopy={raceStatsCopy}
                                                setRaceStatsCopy={setRaceStatsCopy}
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
                                                classStatsCopy={classStatsCopy}
                                                setClassStatsCopy={setClassStatsCopy}
                                                raceStatsCopy={raceStatsCopy}
                                                setRaceStatsCopy={setRaceStatsCopy}
                                                allItems={allItems}
                                                setAllItems={setAllItems}
                                                />} 
                                                />
                <Route path='/allitems'>
                    <Route index element={<AllItemsView selectedCharacterId={selectedCharacterId} equippedItemsCopy={equippedItemsCopy} setEquippedItemsCopy={setEquippedItems} />} />
                    <Route path="itemdetails/:itemId" element={<ItemDetails />} />
                    <Route path="edititem/:itemId" element={<EditItem />} />
                </Route>
                <Route path="createitem/" element={<CreateItem />} />
                <Route path="myaccount/" element={<MyAccount currentUser={currentUser}/>} />
                <Route path="/" element={<Home />} />
0
            </Route>
        </Routes>
    )  
}

