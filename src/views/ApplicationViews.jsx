import { Route, Routes, Outlet } from "react-router-dom"
import { Navbar } from "../components/navbar/Navbar"
import { ProfileView } from "./ProfileView"
import { CharacterBuilderView } from "./CharacterBuilderView"
import { useState, useEffect } from "react"
import { AllItemsView } from "./AllItemsView"
import { ItemDetails } from "../components/itemDetails/ItemDetails"
import { EditItem } from "../components/editItem/EditItem"
import { CreateItem } from "../components/createItem/CreateItem"

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
                                                />} 
                                                />
                <Route path='/allitems'>
                    <Route index element={<AllItemsView />} />
                    <Route path="itemdetails/:itemId" element={<ItemDetails />} />
                    <Route path="edititem/:itemId" element={<EditItem />} />
                </Route>
                <Route path="createitem/" element={<CreateItem />} />
0
                {/* <Route path="/retailers">
                    <Route index element={<RetailersList/>} />
                    <Route path=":retailerId" element={<RetailerDetails currentUser={currentUser} setShoppingCart={setShoppingCart} shoppingCart={shoppingCart}/>}/>
                </Route> */}
            </Route>
        </Routes>
    )  
}

