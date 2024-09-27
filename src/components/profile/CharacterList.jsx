import './CharacterList.css'
import { getAllUserCharacters } from '../../services/characterServices'
import { useState, useEffect } from 'react'

export const CharacterList = ({ currentUser, setSelectedCharacter }) => {
    const [characters, setCharacters] = useState([])

    useEffect(() => {
        getAllUserCharacters(currentUser).then(char => {
            setCharacters(char)
            console.log(char)
        })
    }, [])

    const handleCreateCharacter = async () => {
        console.log(characters)
        if (characters.length === 5) {
            window.alert("You cannot create any more characters!")
            return
        }
        const blankCharacter = {
            userId: currentUser,
            name: 'Filler',
            race: '',
            class: '',
            weaponSkill: '',
            baseStr: 0,
            baseDex: 0,
            baseAgi: 0,
            attackPower: 0,
            weaponSlot1: null
        }
        return fetch("http://localhost:8088/characters", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(blankCharacter),
        }).then(res => res.json()).then(
            getAllUserCharacters(currentUser).then(char => {
                setCharacters(char)
                console.log(char)
            })
        )
    }

    return (
        <div className='character-list col-4 mx-2' key={currentUser}>
            <h2>Your Characters</h2>
            <button onClick={handleCreateCharacter}>Create New Character</button>
            <ul>
                {characters.map(character => {
                    return <li onClick={() => {
                        setSelectedCharacter(character.id)
                    }}>{character.name}</li>
                })}
            </ul>
        </div>
    )
}