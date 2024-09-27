import { getAllUserCharacters } from "../../services/characterServices"
import { getCharacterById } from "../../services/characterServices"
import { useState, useEffect } from "react"

export const Character = ({ currentUser, selectedCharacter }) => {
    const [character, setCharacter] = useState({})
    useEffect(() => {
        getCharacterById(selectedCharacter).then(userCharacter => {
            setCharacter(userCharacter[0])
            console.log(userCharacter[0])
            console.log(selectedCharacter)
        })
    }, [selectedCharacter])
    
    return (
        <div className='character-sheet mx-2 d-flex flex-column col-5 h-75'>
            <h2>{character ? character.name : ''}</h2>
            <ul>
                <li>STR: {character ? character.baseStr : 'not found'}</li>
                <li>DEX: {character ? character.baseDex : 'not found'}</li>
                <li>AGI: {character ? character.baseAgi : 'not found'}</li>
            </ul>
            <div className='bot-container'>
                <div className='bot-left-container'>
                    <ul>
                        <li>Top Weapon Damage  100</li>
                        <li>Bot Weapon Damage  50</li>
                        <li>Attack Power  25</li>
                    </ul>
                </div>
                <div className='bot-right-container'>
                    <h6>Damage Range</h6>
                    <div>50 - 100</div>
                    <h6>Average Damage</h6>
                    <div>75</div>
                </div>

            </div>
            <div className='buttons-container'>
                    <button>Edit</button>
                    <button>Delete</button>
                </div>
        </div>
    )
}