import './CreateCharacterModal.css'; // Optional: CSS for styling the modal
import { useState } from 'react';
import React from 'react';
import ReactDOM from 'react-dom'

export const CreateCharacterModal = ({ initializeCharacter, setSelectedCharacterId, currentUser, toggleModal }) => {
    const [newCharacter, setNewCharacter] = useState(
        {
            userId: currentUser,
            classStatsId: 1,
            raceStatsId: 1,
            name: '',
            race: '',
            class: '',
            weaponTypeEquipped: 'onehanded',
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
    )
    const [classStats, setClassStats] = useState({str: 0, dex: 0, agi: 0})
    const [raceStats, setRaceStats] = useState({str: 0, dex: 0, agi: 0})

    const handleSaveCharacter = async (event) => {
        event.preventDefault()
        const charactersRes = await fetch("http://localhost:8088/characters", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newCharacter),
        })
        const characterData = await charactersRes.json()
        const emptyLeftHand = {
            characterId: characterData.id,
            itemId: 1,
            slotId: "weapon",    
        }
        const emptyRightHand = {
            characterId: characterData.id,
            itemId: 2,
            slotId: "weapon",    
        }
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

        setSelectedCharacterId(characterData.id)
        initializeCharacter(characterData)
        toggleModal()
    }

    const handleTextChange = (event) => {
        let copy = {...newCharacter}
        copy.name = event.target.value
        setNewCharacter(copy)
    }

    const handleDecrement = (stat) => {
        let copy = {...newCharacter}
        if (copy[stat] - 1 < 0) {
            return
        }
        copy[stat]--
        setNewCharacter(copy)
    }

    const handleIncrement = (stat) => {
        let copy = {...newCharacter}
        copy[stat]++
        setNewCharacter(copy)
    }

    const handleClassSelect = (e) => {
        let copy = {...newCharacter}
        const characterClass = e?.target.value
        if (characterClass === 'Select Class' || characterClass === undefined) {
            copy.characterClass = 'none'
            copy.classStatsId = 1
            copy.class = 'none'
            setClassStats({str: 0, dex: 0, agi: 0, characterClass: 'none'})
            setNewCharacter(copy)
        }
        if (characterClass === 'Berserker') {
            copy.characterClass = 'berserker'
            copy.classStatsId = 2
            copy.class = 'berserker'
            setClassStats({str: 10, dex: 0, agi: 0})
            setNewCharacter(copy)
        }
        if (characterClass === 'Fighter') {
            copy.characterClass = 'fighter'
            copy.classStatsId = 3
            copy.class = 'fighter'
            setClassStats({str: 5, dex: 5, agi: 0})
            setNewCharacter(copy)
        }
        if (characterClass === 'Assassin') {
            copy.characterClass = 'assassin'
            copy.classStatsId = 4
            copy.class = 'assassin'
            setClassStats({str: 0, dex: 5, agi: 5})
            setNewCharacter(copy)
        }
    }

    const handleRaceSelect = (e) => {
        let copy = {...newCharacter}
        const characterRace = e?.target.value
        if (characterRace === 'Select Race' || characterRace === undefined) {
            copy.characterRace = 'none'
            copy.raceStatsId = 1
            copy.race = 'none'
            setRaceStats({str: 0, dex: 0, agi: 0, characterRace: 'none'})
            setNewCharacter(copy)
        }
        if (characterRace === 'Human') {
            copy.characterRace = 'human'
            copy.raceStatsId = 2
            copy.race = 'human'
            setRaceStats({str: 2, dex: 2, agi: 2})
            setNewCharacter(copy)
        }
        if (characterRace === 'Elf') {
            copy.characterRace = 'elf'
            copy.raceStatsId = 3
            copy.race = 'elf'
            setRaceStats({str: 0, dex: 3, agi: 3})
            setNewCharacter(copy)
        }
        if (characterRace === 'Half-Elf') {
            copy.characterRace = 'half-elf'
            copy.raceStatsId = 4
            copy.race = 'half-elf'
            setRaceStats({str: 1, dex: 2, agi: 3})
            setNewCharacter(copy)
        }
        if (characterRace === 'Half-Minotaur') {
            copy.characterRace = 'half-minotaur'
            copy.raceStatsId = 5
            copy.race = 'half-minotaur'
            setRaceStats({str: 6, dex: 0, agi: 0})
            setNewCharacter(copy)
        }
    }

  return ReactDOM.createPortal(
    <div className="create-character-modal-overlay" onClick={toggleModal}>
      <div className="create-character-modal-content" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={(event) => handleSaveCharacter(event)}>
                <fieldset className='create-character-fieldset'>
                    <div className="new-character-name">
                        <legend>Create New Character</legend>
                        <label for="name">Name</label>
                        <input required type="text" id="name" name="name" onChange={handleTextChange} />
                    </div>
                    <div className="new-character-class-and-race">
                        <label>Class</label>
                        <select required id="class-select" name="class-select" onChange={handleClassSelect}>
                            <option>Select Class</option>
                            <option>Berserker</option>
                            <option>Fighter</option>
                            <option>Assassin</option>
                        </select>
                        <label>Race</label>
                        <select required id="race-select" name="race-select" onChange={handleRaceSelect}>
                            <option>Select Race</option>
                            <option>Human</option>
                            <option>Elf</option>
                            <option>Half-Elf</option>
                            <option>Half-Minotaur</option>
                        </select>
                    </div>
                    <div className="new-character-attributes">
                        <div className='stat-field'><span className='attribute-string'>Str </span><button type='button' onClick={() => handleDecrement('str')}>-</button><span className='attribute-number'>{newCharacter.str + classStats.str + raceStats.str}</span><button type='button' onClick={() => handleIncrement('str')}>+</button></div>
                        <div className='stat-field'><span className='attribute-string'>Dex </span><button type='button' onClick={() => handleDecrement('dex')}>-</button><span className='attribute-number'>{newCharacter.dex + classStats.dex + raceStats.dex}</span><button type='button' onClick={() => handleIncrement('dex')}>+</button></div>
                        <div className='stat-field'><span className='attribute-string'>Agi </span><button type='button' onClick={() => handleDecrement('agi')}>-</button><span className='attribute-number'>{newCharacter.agi + classStats.agi + raceStats.agi}</span><button type='button' onClick={() => handleIncrement('agi')}>+</button></div>
                    </div>
                    <div className='new-character-buttons-container'>
                        <button type='button' onClick={toggleModal}>Cancel</button>
                        <button>Confirm</button>
                    </div>
                </fieldset>
            </form>
      </div>
    </div>,
        document.getElementById('modal-root')
  );
}