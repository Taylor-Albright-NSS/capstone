import './CharacterList.css'
import { getAllUserCharacters, getCharacterById } from '../../services/characterServices'
import { getAllEquippedItems } from '../../services/itemServices'
import { getCharacterClassAndRaceStats } from '../../services/statsServices'
import { useState, useEffect } from 'react'

export const CharacterList = ({ currentUser, selectedCharacterId, setSelectedCharacterId, classStats,
    setClassStats, raceStats, setRaceStats, character, setCharacter, characterCopy, setCharacterCopy,
    equippedItems, setEquippedItems, equippedItemsCopy, setEquippedItemsCopy, classStatsCopy,
    setClassStatsCopy, raceStatsCopy, setRaceStatsCopy
 }) => {
    const [characterList, setCharacterList] = useState([])

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
            baseStr: 0,
            baseDex: 0,
            baseAgi: 0,
            incrementedStr: 0,
            incrementedDex: 0,
            incrementedAgi: 0,
            attackPower: 0,
            weaponSlot1: null,
            weaponSlot2: null
        }
        await fetch("http://localhost:8088/characters", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(blankCharacter),
        })
        getAllUserCharacters(currentUser).then(char => {
            setCharacterList(char)
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
                            console.log(character.id, ' CHARACTER ID')
                            getCharacterById(character.id).then(userCharacter => {
                                setCharacterCopy({...userCharacter[0]})
                            })
                            getAllEquippedItems(character.id).then(equipmentArray => {
                                setEquippedItemsCopy([...equipmentArray])
                            })
                            getCharacterClassAndRaceStats(character.id).then(stats => {
                                setClassStatsCopy({...stats[0].classStats})
                                setRaceStatsCopy({...stats[0].raceStats})
                            })
                        }}>{character.name}</li>
                    })}
                </ul>
            </div>
        </div>
    )
}