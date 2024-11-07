import './CharacterList.css'
import { getAllUserCharacters, getCharacterById } from '../../services/characterServices'
import { getAllEquippedItems, getAllEquippedItems2, getAllEquippedItems3 } from '../../services/itemServices'
import { getCharacterClassAndRaceStats } from '../../services/statsServices'
import { getSingleItem } from '../../services/itemServices'
import { useState, useEffect } from 'react'
import { getAllDatabaseCharacters } from '../../services/characterServices'
import { CreateCharacterModal } from '../common/CreateCharacterModal'

export const CharacterList = ({ currentUser, selectedCharacterId, setSelectedCharacterId, classStats,
    setClassStats, raceStats, setRaceStats, character, setCharacter, characterCopy, setCharacterCopy,
    equippedItems, setEquippedItems, equippedItemsCopy, setEquippedItemsCopy, classStatsCopy,
    setClassStatsCopy, raceStatsCopy, setRaceStatsCopy
 }) => {
    const [characterList, setCharacterList] = useState([])
    const [testGear, setTestGear] = useState({})
    const [newCharacterId, setNewCharacterId] = useState(0)
    const [allDatabaseCharacters, setAllDatabaseCharacters] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const toggleModal = () => setIsModalOpen(!isModalOpen)


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
            daggers: 1,
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

    const initializeCharacter = async (character) => {
        console.log(character)
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
    }

    const handleCharacterDelete = async () => {
        if (selectedCharacterId === 0) {
            window.alert("You need to select a character before you can delete!")
            return
        } else if (window.confirm(`Are you sure you want to delete ${character.name}?`)) {
                await fetch(`http://localhost:8088/characters/${selectedCharacterId}`, {
                    method: "DELETE",
                })
                await fetch(`http://localhost:8088/character_items/characterId=${selectedCharacterId}`, {
                    method: "DELETE",
                })
                setSelectedCharacterId(0)
            }
    }

    return (
        <div className='character-list'>
            <h2>Characters</h2>
            <button onClick={() => {setIsModalOpen(!isModalOpen)}}>Create New Character</button>
            {isModalOpen && <CreateCharacterModal initializeCharacter={initializeCharacter} setSelectedCharacterId={setSelectedCharacterId} currentUser={currentUser} toggleModal={toggleModal} handleCreateCharacter={handleCreateCharacter} />}
            <div className='characters'>
                    {characterList.map(character => {
                        return <li key={character.id} onClick={(e) => {
                            initializeCharacter(character)
                        }}>{character.name}</li>
                    })}
            </div>
            <button className='delete-character-button' onClick={() => {handleCharacterDelete()}}>Delete Character</button>
        </div>
    )
}