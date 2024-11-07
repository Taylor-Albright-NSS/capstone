import './CharacterSheet.css'
import { getCharacterById, getEquippedWeapons, getAllUserCharacters } from "../../services/characterServices"
import { useState, useEffect } from "react"
import { getAllEquippedItems, getSingleItem } from '../../services/itemServices'
import { getCharacterClassAndRaceStats } from '../../services/statsServices'
import { Navigate, useNavigate } from 'react-router-dom'

export const CharacterSheet = ({ currentUser, selectedCharacterId, setSelectedCharacterId, classStats,
    setClassStats, raceStats, setRaceStats, character, setCharacter, characterCopy, setCharacterCopy,
    equippedItems, setEquippedItems, equippedItemsCopy, setEquippedItemsCopy, classStatsCopy,
    setClassStatsCopy, raceStatsCopy, setRaceStatsCopy
 }) => {

    const navigate = useNavigate()

    useEffect(() => {
        getCharacterById(selectedCharacterId).then(userCharacter => {
            setCharacter(userCharacter[0])
        })
    }, [selectedCharacterId])

    useEffect(() => {
        const fetchEquippedItems = async () => {
            const equipmentArray = await getAllEquippedItems(selectedCharacterId);
            console.log(equipmentArray)
            const updatedEquipmentArray = await Promise.all(equipmentArray.map(async (item) => {
                const singleItemArray = await getSingleItem(item.itemId);
                item.item = singleItemArray[0];
                return item
            }));
            console.log(updatedEquipmentArray)
            setEquippedItems(updatedEquipmentArray)
        };
    
        fetchEquippedItems();
    }, [selectedCharacterId]);

    useEffect(() => {
        getCharacterClassAndRaceStats(selectedCharacterId).then(stats => {
            if (stats[0]) {
                setClassStats(stats[0].classStats)
                setRaceStats(stats[0].raceStats)
            }
        })
    }, [selectedCharacterId])

    const calculcateStatsFromEquipment = () => {
        let weapons = equippedItems.filter(item => item?.item?.slotId === 'weapon')
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
        let weapons = equippedItems.filter(item => item?.item?.slotId === 'weapon')
        console.log(equippedItems)
        console.log(weapons)
        if (character.weaponTypeEquipped === 'onehanded') {
            let topMultiplier = 0.15 + character.oneHanded / 20
            let botMultiplier = 0.15 + character.oneHanded / 20

            damageObject.attackPower = Math.ceil((totalStats.str + totalStats.dex + (totalStats.agi * 0.5)) * 0.5)
            damageObject.speed = Math.max(2, parseFloat((5.2 - Math.floor((character.oneHanded / 5) * 100) / 100).toFixed(0)))
            damageObject.botDamage1 = Math.ceil(damageObject.attackPower * (botMultiplier * weapons[0]?.item.botDamage))
            damageObject.topDamage1 = Math.ceil(damageObject.attackPower * (topMultiplier * weapons[0]?.item.topDamage))
            damageObject.botDamage2 = weapons[1] && Math.ceil(damageObject.attackPower * (botMultiplier * weapons[1].item.botDamage))
            damageObject.topDamage2 = weapons[1] && Math.ceil(damageObject.attackPower * (topMultiplier * weapons[1].item.topDamage))


            damageObject.totalDamageBot = parseFloat(((damageObject.botDamage1 || 0) + (damageObject.botDamage2 || 0)).toFixed(2))
            damageObject.totalDamageTop = parseFloat(((damageObject.topDamage1 || 0) + (damageObject.topDamage2 || 0)).toFixed(2))
            damageObject.totalAverageDamage = parseFloat(((damageObject.totalDamageBot + damageObject.totalDamageTop) / 2).toFixed(2))
            damageObject.totalDps = parseFloat((damageObject.totalAverageDamage / damageObject.speed).toFixed(1))


        }
        if (character.weaponTypeEquipped === 'twohanded') {
            let topMultiplier = 0.15 + character.twoHanded / 20
            let botMultiplier = 0.15 + character.twoHanded / 20

            damageObject.attackPower = Math.ceil((totalStats.str * 2) + ((totalStats.dex + totalStats.agi) * 0.5))
            damageObject.speed = Math.max(2, parseFloat((5.2 - Math.floor((character.twoHanded / 5) * 100) / 100).toFixed(0)))
            
            damageObject.topDamage1 = Math.ceil(damageObject.attackPower * (topMultiplier * weapons[0]?.item.topDamage))
            damageObject.botDamage1 = Math.ceil(damageObject.attackPower * (botMultiplier * weapons[0]?.item.botDamage))

            damageObject.totalDamageBot = parseFloat(((damageObject.botDamage1 || 0)).toFixed(0))
            damageObject.totalDamageTop = parseFloat(((damageObject.topDamage1 || 0)).toFixed(0))
            damageObject.totalAverageDamage = parseFloat(((damageObject.totalDamageBot + damageObject.totalDamageTop) / 2).toFixed(0))
            damageObject.totalDps = parseFloat((damageObject.totalAverageDamage / damageObject.speed).toFixed(1))
        }
        if (character.weaponTypeEquipped === 'daggers') {
            let topMultiplier = 0.15 + character.daggers / 20
            let botMultiplier = 0.15 + character.daggers / 20

            damageObject.attackPower = Math.ceil((totalStats.dex + totalStats.agi + (totalStats.str * 0.5)) * 0.5)
            damageObject.speed = Math.max(2, parseFloat((5.2 - Math.floor((character.daggers / 5) * 100) / 100).toFixed(0)))
            damageObject.botDamage1 = Math.ceil(damageObject.attackPower * (botMultiplier * weapons[0]?.item.botDamage))
            damageObject.topDamage1 = Math.ceil(damageObject.attackPower * (topMultiplier * weapons[0]?.item.topDamage))
            damageObject.botDamage2 = weapons[1] && Math.ceil(damageObject.attackPower * (botMultiplier * weapons[1].item.botDamage))
            damageObject.topDamage2 = weapons[1] && Math.ceil(damageObject.attackPower * (topMultiplier * weapons[1].item.topDamage))


            damageObject.totalDamageBot = parseFloat(((damageObject.botDamage1 || 0) + (damageObject.botDamage2 || 0)).toFixed(2))
            damageObject.totalDamageTop = parseFloat(((damageObject.topDamage1 || 0) + (damageObject.topDamage2 || 0)).toFixed(2))
            damageObject.totalAverageDamage = parseFloat(((damageObject.totalDamageBot + damageObject.totalDamageTop) / 2).toFixed(2))
            damageObject.totalDps = parseFloat((damageObject.totalAverageDamage / damageObject.speed).toFixed(1))
        }
        console.log(damageObject, ' DAMAGE OBJECT')
        return damageObject
    }



    const weaponInformation = (weapon) => {
        if (!weapon?.item?.name) {
            return (
                <ul>
                    <p>WEAPON</p>
                    <li></li>
                    <li>{''}</li>
                    <li>{''}</li>
                    <li>{''}</li>
                </ul>
            )
        }
        return (    <div className='test'>
                        <h6>{weapon.item.name}</h6>
                        <img src={weapon?.item?.image?.imageURL} />
                        <p>Damage: {weapon.item.botDamage + ' - ' + weapon.item.topDamage}</p>
                        <div className='character-sheet-item-attributes'>
                            <p>{weapon.item.str ? 'Str: ' + weapon.item.str : ''}</p>
                            <p>{weapon.item.dex ? 'Dex: ' + weapon.item.dex : ''}</p>
                            <p>{weapon.item.agi ? 'Agi: ' + weapon.item.agi : ''}</p>
                        </div>
                    </div>
        )
    }

    const displayWeapon1 = () => {
        // let weapons = equippedItems.filter(item => item.item.slotId === 'weapon')
            return weaponInformation(equippedItems[0])
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
                <ul>
                    <p>{itemString}</p>
                    <li></li>
                    <li>{''}</li>
                    <li>{''}</li>
                    <li>{''}</li>
                </ul>
            )
        }
        return (
                <ul>
                    <p style={{color: item.item.color}}>{item.item.name}</p>
                    <li>Damage: {item.item.botDamage + ' - ' + item.item.topDamage}</li>
                    <li>{item.item.str ? 'STR: ' + item.item.str : ''}</li>
                    <li>{item.item.dex ? 'DEX: ' + item.item.dex : ''}</li>
                    <li>{item.item.agi ? 'AGI: ' + item.item.agi : ''}</li>
                </ul>
        )
    }




    return (
        <div className='character-sheet d-flex flex-column col-5'>
            <h2>{character ? character.name + ' - ' + character.race + ' ' + character.class : 'No Character Selected'}</h2>
            <div className='top-container'>
                    <div className='character-stats-container'>
                        <div className="character-sheet-attributes">
                            <h6>Stats</h6>
                            <li>STR: {character ? totalStats.str : 0}</li>
                            <li>DEX: {character ? totalStats.dex : 0}</li>
                            <li>AGI: {character ? totalStats.agi : 0}</li>
                            <li>Attack Power: {calculateAttackPower()?.attackPower ? calculateAttackPower().attackPower : 0}</li>
                            <li>Speed: {calculateAttackPower()?.speed ? calculateAttackPower().speed : 0}</li>

                        </div>
                        <div className="character-sheet-skills">
                            <h6>Skills</h6>
                            <li className={character?.weaponTypeEquipped === 'onehanded' ? 'selected-weapon-skill' : ''}>Onehanded: {character?.oneHanded ? character.oneHanded : 0}</li>
                            <li className={character?.weaponTypeEquipped === 'twohanded' ? 'selected-weapon-skill' : ''}>Twohanded: {character?.twoHanded ? character.twoHanded : 0}</li>
                            <li className={character?.weaponTypeEquipped === 'daggers' ? 'selected-weapon-skill' : ''}>Daggers: {character?.daggers ? character.daggers : 0}</li>
                        </div>

                    </div>
                <div className='character-equipment-container col-12'>
                    <ul className='items'>
                        <li className='col-3 equipped-item'>{displayWeapon1()}</li>
                        <li className='col-3 equipped-item'>{displayWeapon2()}</li>
                    </ul>
                </div>
            </div>
                <div className='damage-container'>
                    <h5>Damage Range</h5>
                    <span className='damage damage-range'>{calculateAttackPower()?.totalDamageBot ? calculateAttackPower().totalDamageBot + ' - ' + calculateAttackPower()?.totalDamageTop : 0 + ' - ' + 0}</span>
                    <h5>Average Damage</h5>
                    <span className='damage average-damage'>
                        {calculateAttackPower()?.botDamage1 ? calculateAttackPower().totalAverageDamage : 0}
                    </span>
                    <h5>DPS</h5>
                    <span className='damage dps'>{calculateAttackPower()?.botDamage1 ? calculateAttackPower().totalDps : 0}</span>
                </div>            

        </div>
    )    
}

