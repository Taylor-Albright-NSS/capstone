import './CharacterSheet.css'
import { getCharacterById, getEquippedWeapons, getAllUserCharacters } from "../../services/characterServices"
import { useState, useEffect } from "react"
import { getAllEquippedItems } from '../../services/itemServices'
import { getCharacterClassAndRaceStats } from '../../services/statsServices'

export const CharacterSheet = ({ currentUser, selectedCharacterId, setSelectedCharacterId, classStats,
    setClassStats, raceStats, setRaceStats, character, setCharacter, characterCopy, setCharacterCopy,
    equippedItems, setEquippedItems, equippedItemsCopy, setEquippedItemsCopy, classStatsCopy,
    setClassStatsCopy, raceStatsCopy, setRaceStatsCopy
 }) => {

    useEffect(() => {
        getCharacterById(selectedCharacterId).then(userCharacter => {
            setCharacter(userCharacter[0])
        })
    }, [selectedCharacterId])

    useEffect(() => {
        getAllEquippedItems(selectedCharacterId).then(equipmentArray => {
            setEquippedItems(equipmentArray)
        })
    }, [selectedCharacterId])

    useEffect(() => {
        getCharacterClassAndRaceStats(selectedCharacterId).then(stats => {
            setClassStats(stats[0].classStats)
            setRaceStats(stats[0].raceStats)
            console.log(stats, ' SHOULD BE STATS')
        })
    }, [selectedCharacterId])





    const [equippedWeapons, setEquippedWeapons] = useState([])

    useEffect(() => {
        getEquippedWeapons(selectedCharacterId).then(weapons => {
            setEquippedWeapons(weapons)
        })
    }, [character])
    const calculcateStatsFromEquipment = () => {
        let weapons = equippedItems.filter(item => item.item.slotId === 'weapon')
        let statsObject = {
            str: 0,
            dex: 0,
            agi: 0
        }
        weapons.forEach(item => {
            console.log(item, ' ITEM')
            if (item.item.str != null) {statsObject.str += item.item.str}
            if (item.item.dex != null) {statsObject.dex += item.item.dex}
            if (item.item.agi != null) {statsObject.agi += item.item.agi}
        })
        return statsObject
    }

    const calculateIncrementedStats = () => {
        const incrementStatsObject = {
            str: character?.str,
            dex: character?.dex,
            agi: character?.agi
        }
        return incrementStatsObject
    }
    const calculateTotalStats = () => {
        let equipmentStats = calculcateStatsFromEquipment()
        let cStats = classStats
        let rStats = raceStats
        let incrementedStats = calculateIncrementedStats()
        let totalStatsObject = {}
        console.log(equipmentStats)
        console.log(cStats)
        console.log(rStats)
        console.log(incrementedStats)
        console.log(totalStatsObject)
        let stats = ['str', 'dex', 'agi']
        stats.forEach(stat => {
            totalStatsObject[stat] = equipmentStats[stat] + cStats[stat] + rStats[stat] + incrementedStats[stat]
        })
        console.log(totalStatsObject)
        return totalStatsObject
    }
    const totalStats = calculateTotalStats()

    const calculateAttackPower = () => {
        if (!character) {
            return
        }
        let damageObject = {}
        let weapons = equippedItems.filter(item => item.item.slotId === 'weapon')
        
        if (character.weaponTypeEquipped === 'onehanded') {
            let topMultiplier = 0.15 + character.oneHanded / 20
            let botMultiplier = 0.15 + character.oneHanded / 20
            damageObject.attackPower = Math.ceil((totalStats.str + totalStats.dex + (totalStats.agi * 0.5)) * 0.5)
            damageObject.speed = Math.max(2, parseFloat((5.2 - Math.floor((character.oneHanded / 5) * 100) / 100).toFixed(1)))
            damageObject.topDamage1 = Math.ceil(damageObject.attackPower * (topMultiplier * weapons[0]?.item.topDamage))
            damageObject.botDamage1 = Math.ceil(damageObject.attackPower * (botMultiplier * weapons[0]?.item.botDamage))
            damageObject.topDamage2 = weapons[1] && Math.ceil(damageObject.attackPower * (topMultiplier * weapons[1].item.topDamage))
            damageObject.botDamage2 = weapons[1] && Math.ceil(damageObject.attackPower * (botMultiplier * weapons[1].item.botDamage))
        }
        if (character.weaponTypeEquipped === 'twohanded') {
            let topMultiplier = 0.15 + character.twoHanded / 20
            let botMultiplier = 0.15 + character.twoHanded / 20
            damageObject.attackPower = Math.ceil((totalStats.str * 2) + ((totalStats.dex + totalStats.agi) * 0.5))
            damageObject.speed = Math.max(2, parseFloat((5.2 - Math.floor((character.twoHanded / 5) * 100) / 100).toFixed(1)))
            damageObject.topDamage1 = Math.ceil(damageObject.attackPower * (topMultiplier * weapons[0]?.item.topDamage))
            damageObject.botDamage1 = Math.ceil(damageObject.attackPower * (botMultiplier * weapons[0]?.item.botDamage))
        }
        return damageObject
    }

    const totalDamages = () => {
        return (
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
        )
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
                <ul className='item-info'>
                    <p>WEAPON</p>
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

    const displayWeapon1 = () => {
        // let weapons = equippedItems.filter(item => item.item.slotId === 'weapon')
        if (equippedItems[0]) {
            return weaponInformation(equippedItems[0])
        } else {
            return weaponInformation()
        }
    }
    const displayWeapon2 = () => {
        // let weapons = equippedItems.filter(item => item.item.slotId === 'weapon')
        if (equippedItems[1]) {
            return weaponInformation(equippedItems[1])
        } else {
            return weaponInformation()
        }
    }

    const itemInformation = (item, itemString) => {
        if (!item) {
            return (
                <ul className='item-info'>
                    <p>{itemString}</p>
                    <li></li>
                    <li>{''}</li>
                    <li>{''}</li>
                    <li>{''}</li>
                </ul>
            )
        }
        return (
                <ul className='item-info'>
                    <p style={{color: item.item.color}}>{item.item.name}</p>
                    <li>Damage: {item.item.botDamage + ' - ' + item.item.topDamage}</li>
                    <li>{item.item.str ? 'STR: ' + item.item.str : ''}</li>
                    <li>{item.item.dex ? 'DEX: ' + item.item.dex : ''}</li>
                    <li>{item.item.agi ? 'AGI: ' + item.item.agi : ''}</li>
                </ul>
        )
    }




    return (
        <div className='character-sheet mx-2 d-flex flex-column col-5'>
            <h2>{character ? character.name : 'No Character Selected'}</h2>
            <div className='top-container'>
                    <ul className='character-stats-container col-6 attributes'>
                        <p>Attributes</p>
                        <li>{character ? 'STR: ' + totalStats.str : ''}</li>
                        <li>{character ? 'DEX: ' + totalStats.dex : ''}</li>
                        <li>{character ? 'AGI: ' + totalStats.agi : ''}</li>
                        {/* <li>{character ? 'INT: ' + character.baseAgi : ''}</li>
                        <li>{character ? 'WIS: ' + character.baseAgi : ''}</li>
                        <li>{character ? 'MYS: ' + character.baseAgi : ''}</li>
                        <li>{character ? 'CON: ' + character.baseAgi : ''}</li> */}
                    </ul>
                    <ul className='character-stats-container col-6 power'>
                        <p>Offense</p>
                        <li>Attack Power: {calculateAttackPower()?.attackPower ? calculateAttackPower().attackPower : 0}</li>
                        <li>{character?.class === 'mage' ? 'Spell Power: ' + calculateAttackPower().attackPower : ''}</li>
                        <li>{character?.class === 'mage' ? 'Mystic Power: ' + calculateAttackPower().attackPower : ''}</li>
                        <li>Speed: {calculateAttackPower()?.speed ? calculateAttackPower().speed : 0}</li>
                        <li>Accuracy: {calculateAttackPower()?.accuracy ? calculateAttackPower().accuracy : 0}</li>
                    </ul>
                    {/* <ul className='defense character-stats-container col-5'>
                        <p>Defense</p>
                        <li>{character ? 'Attack Power: ' + calculateAttackPower().attackPower : ''}</li>
                        <li>{character ? 'Slashing Armor: ' + calculateAttackPower().attackPower : ''}</li>
                        <li>{character ? 'Piercing Armor: ' + calculateAttackPower().attackPower : ''}</li>
                        <li>{character ? 'Blunt Armor: ' + calculateAttackPower().attackPower : ''}</li>
                    </ul> */}
                <div className='character-equipment-container col-12'>
                <h2>Equipment</h2>
                    <ul className='items'>
                        <li className='col-3 slot1'>{displayWeapon1()}</li>
                        <li className='col-3 slot2'>{displayWeapon2()}</li>
                        <li className='col-3 slot3'>{itemInformation(undefined, 'chest')}</li>
                        <li className='col-3 slot3'>{itemInformation(undefined, 'helm')}</li>
                        <li className='col-3 slot3'>{itemInformation(undefined, 'shoulders')}</li>
                        <li className='col-3 slot3'>{itemInformation(undefined, 'leggings')}</li>
                        <li className='col-3 slot3'>{itemInformation(undefined, 'gloves')}</li>
                        <li className='col-3 slot3'>{itemInformation(undefined, 'boots')}</li>
                    </ul>
                </div>
            </div>
            <div className='bot-container'>
                <div className='total-damages'>
                    <h5>Damage Range</h5>
                    <span className='damage damage-range'>{calculateAttackPower()?.botDamage1 ? calculateAttackPower().botDamage1 + ' - ' + calculateAttackPower()?.topDamage1 : 0 + ' - ' + 0}</span>
                    <h5>Average Damage</h5>
                    <span className='damage average-damage'>
                        {calculateAttackPower()?.botDamage1 ? Math.ceil((calculateAttackPower().botDamage1 + calculateAttackPower().topDamage1) * 0.5) : 0}
                    </span>
                    <h5>DPS</h5>
                    <span className='damage dps'>{calculateAttackPower()?.botDamage1 ? (Math.ceil(((calculateAttackPower().botDamage1 + calculateAttackPower().topDamage1) * 0.5)) / calculateAttackPower().speed).toFixed(1) : 0}</span>
                </div>            
            </div>
            <div className='buttons-container'>
                <button>Edit</button>
                <button onClick={() => {handleCharacterDelete()}}>Delete</button>
            </div>
        </div>
    )    
}

