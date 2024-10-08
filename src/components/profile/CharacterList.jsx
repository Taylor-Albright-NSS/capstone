import './CharacterList.css'
import { getAllUserCharacters, getCharacterById } from '../../services/characterServices'
import { getAllEquippedItems, getAllEquippedItems2, getAllEquippedItems3 } from '../../services/itemServices'
import { getCharacterClassAndRaceStats } from '../../services/statsServices'
import { getSingleItem } from '../../services/itemServices'
import { useState, useEffect } from 'react'
import { getAllDatabaseCharacters } from '../../services/characterServices'

export const CharacterList = ({ currentUser, selectedCharacterId, setSelectedCharacterId, classStats,
    setClassStats, raceStats, setRaceStats, character, setCharacter, characterCopy, setCharacterCopy,
    equippedItems, setEquippedItems, equippedItemsCopy, setEquippedItemsCopy, classStatsCopy,
    setClassStatsCopy, raceStatsCopy, setRaceStatsCopy
 }) => {
    const [characterList, setCharacterList] = useState([])
    const [testGear, setTestGear] = useState({})
    const [newCharacterId, setNewCharacterId] = useState(0)
    const [allDatabaseCharacters, setAllDatabaseCharacters] = useState([])

    useEffect(() => {
        getAllDatabaseCharacters().then(allCharsArray => {
            setAllDatabaseCharacters(allCharsArray)
        })
    }, [selectedCharacterId])

    useEffect(() => {
        getAllDatabaseCharacters().then(allCharsArray => {
            setNewCharacterId(allCharsArray.length)
        })
    }, [allDatabaseCharacters])

    useEffect(() => {
        getAllUserCharacters(currentUser).then(char => {
            setCharacterList(char)
        })
    }, [currentUser, selectedCharacterId])

    const handleCreateCharacter = async () => {
        console.log(characterList)
        if (characterList.length >= 10) {
            window.alert("You cannot create any more characters!")
            return
        } 
        let name = prompt("Enter your character name")
        if (!name) {
            window.alert('character not created')
            return
        }
        const blankCharacter = {
            userId: currentUser,
            classStatsId: 1,
            raceStatsId: 1,
            name: name,
            race: '',
            class: '',
            weaponTypeEquipped: '',
            oneHanded: 1,
            twoHanded: 1,
            unarmed: 1,
            str: 0,
            dex: 0,
            agi: 0,
            attackPower: 0,
            weaponSlot1: null,
            weaponSlot2: null
        }

        const emptyLeftHand = {
            characterId: newCharacterId + 1,
            itemId: 1,
            slotId: "weapon",    
        }
        const emptyRightHand = {
            characterId: newCharacterId + 1,
            itemId: 2,
            slotId: "weapon",    
        }

        await fetch("http://localhost:8088/characters", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(blankCharacter),
        })
        await fetch("http://localhost:8088/character_items", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(emptyLeftHand),
        })
        await fetch("http://localhost:8088/character_items", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(emptyRightHand),
        })
        getAllUserCharacters(currentUser).then(char => {
            setCharacterList(char)
            setSelectedCharacterId(newCharacterId + 1)
        })
        getCharacterById(character.id).then(userCharacter => {
            setCharacterCopy({...userCharacter[0]})
        })
        getCharacterClassAndRaceStats(character.id).then(stats => {
            setClassStatsCopy({...stats[0].classStats})
            setRaceStatsCopy({...stats[0].raceStats})
        })
        getAllEquippedItems3(character.id).then(equipmentArray => {
            console.log(equipmentArray)
            setEquippedItemsCopy(equipmentArray)
        })
    }

    return (
        <div className='character-list col-4 mx-2'>
            <h2>Your Characters</h2>
            <button onClick={handleCreateCharacter}>Create New Character</button>
            <div className='characters'>
                <ul>
                    {characterList.map(character => {
                        return <li key={character.id} onClick={(e) => {

                            setSelectedCharacterId(character.id)
                            getCharacterById(character.id).then(userCharacter => {
                                setCharacterCopy({...userCharacter[0]})
                            })
                            getCharacterClassAndRaceStats(character.id).then(stats => {
                                setClassStatsCopy({...stats[0].classStats})
                                setRaceStatsCopy({...stats[0].raceStats})
                            })
                            getAllEquippedItems3(character.id).then(equipmentArray => {
                                console.log(equipmentArray)
                                setEquippedItemsCopy(equipmentArray)
                            })

                        }}>{character.name}</li>
                    })}
                </ul>
            </div>
        </div>
    )
}