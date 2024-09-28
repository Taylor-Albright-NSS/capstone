import './CharacterList.css'
import { getAllUserCharacters } from '../../services/characterServices'
import { useState, useEffect } from 'react'

export const CharacterList = ({ currentUser, selectedCharacterId, setSelectedCharacterId }) => {
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
        console.log(selectedCharacterId)
        const blankCharacter = {
            userId: currentUser,
            name: name,
            race: '',
            class: '',
            weaponTypeEquipped: '',
            oneHanded: 0,
            twoHanded: 0,
            baseStr: 0,
            baseDex: 0,
            baseAgi: 0,
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
                setSelectedCharacterId(0)
            })
    }

    return (
        <div className='character-list col-4 mx-2'>
            <h2>Your Characters</h2>
            <button onClick={handleCreateCharacter}>Create New Character</button>
            <div className='characters'>
                <ul>
                    {characterList.map(character => {
                        return <li key={character.id} onClick={() => {
                            setSelectedCharacterId(character.id)
                        }}>{character.name}</li>
                    })}
                </ul>
            </div>
        </div>
    )
}