import { CharacterBuilder } from "../components/characterBuilder/CharacterBuilder"
import { ItemSelector } from "../components/characterBuilder/ItemSelector"
import { getCharacterById } from "../services/characterServices"
import { getEquippedWeapons } from "../services/characterServices"
import { useState, useEffect } from "react"

export const CharacterBuilderView = ({ currentUser, selectedCharacterId, setSelectedCharacterId, classStats,
    setClassStats, raceStats, setRaceStats, character, setCharacter, characterCopy, setCharacterCopy,
    equippedItems, setEquippedItems, equippedItemsCopy, setEquippedItemsCopy, classStatsCopy,
    setClassStatsCopy, raceStatsCopy, setRaceStatsCopy
 }) => {
    // const [character, setCharacter] = useState({})
    // const [characterCopy, setCharacterCopy] = useState({})
    // const [equippedItems, setEquippedItems] = useState([])
    // const [equippedItemsCopy, setEquippedItemsCopy] = useState({})

    useEffect(() => {
        getCharacterById(selectedCharacterId).then(character => {
            setCharacter(character[0])
            setCharacterCopy({...character[0]})
            console.log(character)
            })
    }, [])

    useEffect(() => {
        getEquippedWeapons(selectedCharacterId).then(weaponsArray => {
            setEquippedItems(weaponsArray)
        })
    }, [selectedCharacterId])

    useEffect(() => {
        console.log(selectedCharacterId)
        console.log(setSelectedCharacterId)
    }, [])

    return (
        <div className='d-flex'>
            <ItemSelector
            character={character}
            characterCopy={characterCopy}
            setCharacter={setCharacter}
            setCharacterCopy={setCharacterCopy}
            equippedItems={equippedItems}
            setEquippedItems={setEquippedItems}
            equippedItemsCopy={equippedItemsCopy}
            setEquippedItemsCopy={setEquippedItemsCopy}
            classStats={classStats}
            setClassStats={setClassStats}
            raceStats={raceStats}
            setRaceStats={setRaceStats}
            classStatsCopy={classStatsCopy}
            setClassStatsCopy={setClassStatsCopy}
            raceStatsCopy={raceStatsCopy}
            setRaceStatsCopy={setRaceStatsCopy}
             />
            <CharacterBuilder 
            currentUser={currentUser} 
            selectedCharacterId={selectedCharacterId} 
            setSelectedCharacterId={setSelectedCharacterId}
            character={character}
            characterCopy={characterCopy}
            setCharacter={setCharacter}
            setCharacterCopy={setCharacterCopy}
            equippedItems={equippedItems}
            setEquippedItems={setEquippedItems}
            equippedItemsCopy={equippedItemsCopy}
            setEquippedItemsCopy={setEquippedItemsCopy}
            classStats={classStats}
            setClassStats={setClassStats}
            raceStats={raceStats}
            setRaceStats={setRaceStats}
            classStatsCopy={classStatsCopy}
            setClassStatsCopy={setClassStatsCopy}
            raceStatsCopy={raceStatsCopy}
            setRaceStatsCopy={setRaceStatsCopy}
            />
        </div>
    )
}