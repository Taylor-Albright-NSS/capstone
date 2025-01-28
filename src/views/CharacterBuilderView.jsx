import { CharacterBuilder } from "../components/characterBuilder/CharacterBuilder"
import { ItemSelector } from "../components/characterBuilder/ItemSelector"
import { getCharacterById } from "../services/characterServices"
import { getEquippedWeapons } from "../services/characterServices"
import { useEffect } from "react"

export const CharacterBuilderView = ({ currentUser, selectedCharacterId, setSelectedCharacterId, classStats,
    setClassStats, raceStats, setRaceStats, character, setCharacter, characterCopy, setCharacterCopy,
    equippedItems, setEquippedItems, equippedItemsCopy, setEquippedItemsCopy, classStatsCopy,
    setClassStatsCopy, raceStatsCopy, setRaceStatsCopy, allItems, setAllItems
 }) => {

    useEffect(() => {
        getCharacterById(selectedCharacterId).then(character => {
            setCharacter(character[0])
            })
    }, [])

    useEffect(() => {
        getEquippedWeapons(selectedCharacterId).then(weaponsArray => {
            setEquippedItems(weaponsArray)
        })
    }, [selectedCharacterId])

    return (
        <div className='ItemSelector-CharacterBuilder-container'>
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