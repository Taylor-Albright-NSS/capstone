import './CharacterSheet.css'
import { getCharacterById, getEquippedWeapons, getAllUserCharacters } from "../../services/characterServices"
import { useState, useEffect } from "react"

export const CharacterSheet = ({ currentUser, selectedCharacterId, setSelectedCharacterId }) => {
        const [character, setCharacter] = useState({})
        const [equippedWeapons, setEquippedWeapons] = useState([])

        useEffect(() => {
            getEquippedWeapons(selectedCharacterId).then(weapons => {
                console.log(selectedCharacterId)
                console.log(weapons)
                setEquippedWeapons(weapons)
            })
        }, [selectedCharacterId])

        useEffect(() => {
            getCharacterById(selectedCharacterId).then(userCharacter => {
                setCharacter(userCharacter[0])
                console.log(userCharacter[0])
                console.log(selectedCharacterId)
            })
        }, [selectedCharacterId])
    
        useEffect(() => {
                getAllUserCharacters(currentUser).then(char => {
                console.log(char)
                console.log(equippedWeapons, ' EQUIPPED WEAPONS')
            })
        }, [selectedCharacterId])

        const calculateAttackPower = () => {
            if (!character) {
                return
            }
            let damageObject = {}
            let str = character.baseStr
            let dex = character.baseDex
            let agi = character.baseAgi
            equippedWeapons.forEach(item => {
                console.log(item, ' ITEM')
                if (item.item.str != null) {str += item.item.str}
                if (item.item.dex != null) {dex += item.item.dex}
                if (item.item.agi != null) {agi += item.item.agi}
            })
            if (character.weaponTypeEquipped === 'Onehanded') {
                let topMultiplier = 0.15 + character.oneHanded / 20
                let botMultiplier = 0.15 + character.oneHanded / 20
                damageObject.attackPower = Math.ceil((str + dex + (agi * 0.5)) * 0.5)
                damageObject.speed = Math.max(2, parseFloat((5.2 - Math.floor((character.oneHanded / 5) * 100) / 100).toFixed(1)))
                damageObject.topDamage1 = Math.ceil(damageObject.attackPower * (topMultiplier * equippedWeapons[0]?.item.topDamage))
                damageObject.botDamage1 = Math.ceil(damageObject.attackPower * (botMultiplier * equippedWeapons[0]?.item.botDamage))
                damageObject.topDamage2 = equippedWeapons[1] && Math.ceil(damageObject.attackPower * (topMultiplier * equippedWeapons[1].item.topDamage))
                damageObject.botDamage2 = equippedWeapons[1] && Math.ceil(damageObject.attackPower * (botMultiplier * equippedWeapons[1].item.botDamage))
            }
            if (character.weaponTypeEquipped === 'Twohanded') {
                let topMultiplier = 0.15 + character.twoHanded / 20
                let botMultiplier = 0.15 + character.twoHanded / 20
                damageObject.attackPower = Math.ceil((str * 2) + ((dex + agi) * 0.5))
                damageObject.speed = Math.max(2, parseFloat((5.2 - Math.floor((character.twoHanded / 5) * 100) / 100).toFixed(1)))
                damageObject.topDamage1 = Math.ceil(damageObject.attackPower * (topMultiplier * equippedWeapons[0]?.item.topDamage))
                damageObject.botDamage1 = Math.ceil(damageObject.attackPower * (botMultiplier * equippedWeapons[0]?.item.botDamage))
                console.log(damageObject, ' DAMAGE OBJECT')
            }
            console.log(damageObject)
            return damageObject
        }

        const handleCharacterDelete = async () => {
            if (selectedCharacterId === 0) {
                window.alert("You need to select a character before you can delete!")
                return
            } else if (window.confirm(`Are you sure you want to delete ${character.name}?`)) {
                    await fetch(`http://localhost:8088/characters/${selectedCharacterId}`, {
                        method: "DELETE",
                        // headers: {
                        //     "Content-Type": "application/json",
                        // },
                        // body: JSON.stringify(),
                    })
                   await fetch(`http://localhost:8088/character_items/characterId=${selectedCharacterId}`, {
                        method: "DELETE",
                        // headers: {
                        //     "Content-Type": "application/json",
                        // },
                        // body: JSON.stringify(),
                    })
                    setSelectedCharacterId(0)
                }

        }

        const weaponInformation = (weapon) => {
            if (!weapon) {
                return (
                    <ul className='weapon-1-info'>
                        <p></p>
                        <li></li>
                        <li>{''}</li>
                        <li>{''}</li>
                        <li>{''}</li>
                    </ul>
                )
            }
            return (
                    <ul className='weapon-1-info'>
                        <p style={{color: weapon.item.color}}>{weapon.item.name}</p>
                        <li>Damage: {weapon.item.botDamage + ' - ' + weapon.item.topDamage}</li>
                        <li>{weapon.item.str ? 'STR: ' + weapon.item.str : ''}</li>
                        <li>{weapon.item.dex ? 'DEX: ' + weapon.item.dex : ''}</li>
                        <li>{weapon.item.agi ? 'AGI: ' + weapon.item.agi : ''}</li>
                    </ul>
            )
        }

        const totalDamages = () => {
            return (
                <>
                    <div className='total-damages'>
                        <h5>Damage Range</h5>
                        <span className='damage damage-range'>{calculateAttackPower()?.botDamage1 + ' - ' + calculateAttackPower()?.topDamage1}</span>
                        <h5>Average Damage</h5>
                        <span className='damage average-damage'>
                            {Math.ceil((calculateAttackPower()?.botDamage1 + calculateAttackPower()?.topDamage1) * 0.5)}
                            {console.log(calculateAttackPower(), ' CALCULATE ATTACK POWER')}
                            </span>
                        <h5>DPS</h5>
                        <span className='damage dps'>{(Math.ceil(((calculateAttackPower()?.botDamage1 + calculateAttackPower()?.topDamage1) * 0.5)) / calculateAttackPower()?.speed).toFixed(1)}</span>
                            {console.log(calculateAttackPower(), ' CALCULATE ATTACK POWER 2')}
                    </div>
                    {/* <div className='weapon-2-ranges'>
                        <h6>Damage Range</h6>
                        <span>{calculateAttackPower()?.botDamage2 + ' - ' + calculateAttackPower()?.topDamage2}</span>
                        <h6>Average Damage</h6>
                        <span>{Math.ceil((calculateAttackPower()?.botDamage2 + calculateAttackPower()?.topDamage2) * 0.5)}</span>
                        <h6>DPS</h6>
                        <span>{(Math.ceil(((calculateAttackPower()?.botDamage2 + calculateAttackPower()?.topDamage2) * 0.5)) / calculateAttackPower()?.speed).toFixed(1)}</span>
                    </div> */}
                </>
            )
        }
        
        return (
            <div className='character-sheet mx-2 d-flex flex-column col-5'>
                <h2>{character ? character.name : 'No Character Selected'}</h2>
                <div className='top-container'>
                        <ul className='character-stats-container col-3 attributes'>
                            <p>Attributes</p>
                            <li>{character ? 'STR: ' + character.baseStr : ''}</li>
                            <li>{character ? 'DEX: ' + character.baseDex : ''}</li>
                            <li>{character ? 'AGI: ' + character.baseAgi : ''}</li>
                            <li>{character ? 'INT: ' + character.baseAgi : ''}</li>
                            <li>{character ? 'WIS: ' + character.baseAgi : ''}</li>
                            <li>{character ? 'MYS: ' + character.baseAgi : ''}</li>
                            <li>{character ? 'CON: ' + character.baseAgi : ''}</li>
                        </ul>
                        <ul className='character-stats-container col-4 power'>
                            <p>Offense</p>
                            <li>{character ? 'Attack Power: ' + calculateAttackPower().attackPower : ''}</li>
                            <li>{character ? 'Spell Power: ' + calculateAttackPower().attackPower : ''}</li>
                            <li>{character ? 'Mystic Power: ' + calculateAttackPower().attackPower : ''}</li>
                            <li>{character ? 'Speed: ' + calculateAttackPower().attackPower : ''}</li>
                            <li>{character ? 'Accuracy: ' + calculateAttackPower().attackPower : ''}</li>
                        </ul>
                        <ul className='defense character-stats-container col-5'>
                            <p>Defense</p>
                            <li>{character ? 'Attack Power: ' + calculateAttackPower().attackPower : ''}</li>
                            <li>{character ? 'Slashing Armor: ' + calculateAttackPower().attackPower : ''}</li>
                            <li>{character ? 'Piercing Armor: ' + calculateAttackPower().attackPower : ''}</li>
                            <li>{character ? 'Blunt Armor: ' + calculateAttackPower().attackPower : ''}</li>
                        </ul>
                    <div className='character-equipment-container col-12'>
                    <h2>Equipment</h2>
                        <ul className='items'>
                            <li className='col-3'>{equippedWeapons ? weaponInformation(equippedWeapons[0]) : ''}</li>
                            <li className='col-3'>{equippedWeapons ? weaponInformation(equippedWeapons[0]) : ''}</li>
                            <li className='col-3'>{equippedWeapons ? weaponInformation(equippedWeapons[1]) : ''}</li>
                            <li className='col-3'>{equippedWeapons ? weaponInformation(equippedWeapons[1]) : ''}</li>
                            <li className='col-3'>{equippedWeapons ? weaponInformation(equippedWeapons[1]) : ''}</li>
                            <li className='col-3'>{equippedWeapons ? weaponInformation(equippedWeapons[1]) : ''}</li>
                            <li className='col-3'>{equippedWeapons ? weaponInformation(equippedWeapons[1]) : ''}</li>
                            <li className='col-3'>{equippedWeapons ? weaponInformation(equippedWeapons[1]) : ''}</li>
                            <li className='col-3'>{equippedWeapons ? weaponInformation(equippedWeapons[1]) : ''}</li>
                        </ul>
                    </div>
                </div>
                <div className='bot-container'>
                    {totalDamages()}
                </div>
                <div className='buttons-container'>
                    <button>Edit</button>
                    <button onClick={() => {handleCharacterDelete()}}>Delete</button>
                </div>
            </div>
        )    
}