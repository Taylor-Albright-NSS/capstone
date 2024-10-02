import { useState, useEffect } from "react"
import { getCharacterById } from "../../services/characterServices"
import { getEquippedWeapons } from "../../services/characterServices"
import { getSelectedWeapons } from "../../services/itemServices"
import { CharacterSheet } from "character-sheet"
import { calculcateStatsFromEquipment } from "../../services/calculationServices"
import './CharacterBuilder.css'

export const CharacterBuilder = ({ currentUser, selectedCharacterId, setSelectedCharacterId, character, 
    characterCopy, setCharacter, setCharacterCopy, equippedItems, setEquippedItems, equippedItemsCopy,
    setEquippedItemsCopy, classStats, setClassStats, raceStats, setRaceStats, classStatsCopy, setClassStatsCopy,
    raceStatsCopy, setRaceStatsCopy }) => {
    const [equippedWeapons, setEquippedWeapons] = useState([])
    const [showMessage, setShowMessage] = useState(false)
    const [incrementStats, setIncrementStats] = useState({baseStr: 0, baseDex: 0, baseAgi: 0})
    const [statsFromGear, setStatsFromGear] = useState({str: 0, dex: 0, agi: 0})

    useEffect(() => {
        // console.log(calculcateStatsFromEquipment(equippedItemsCopy))
        let combinedBaseStats = {}
        let combinedAllStats = {}
        let statsFromGear = totalStatsFromGear()

        for (const stat in classStats) {
            let classStat = classStats[stat] ? classStats[stat] : 0
            let raceStat = raceStats[stat] ? raceStats[stat] : 0
            let gearStat = statsFromGear[stat] ? statsFromGear[stat] : 0
            combinedBaseStats[stat] = classStat + raceStat + gearStat
        }
        for (const stat in classStats) {
            let classStat = classStats[stat] ? classStats[stat] : 0
            let raceStat = raceStats[stat] ? raceStats[stat] : 0
            let incrementStat = incrementStats[stat] ? incrementStats[stat] : 0
            let gearStat = statsFromGear[stat] ? statsFromGear[stat] : 0
            combinedAllStats[stat] = classStat + raceStat + incrementStat + gearStat
        }
        // setCharacter({...character, ...combinedBaseStats})
        setCharacterCopy({...characterCopy, ...combinedAllStats})
    }, [classStats, raceStats, equippedItemsCopy])

    
const calculcateStatsFromEquipment = () => {
    let weapons = equippedItemsCopy.filter(item => item.item.slotId === 'weapon')
    console.log(weapons)
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
    console.log(statsObject, ' STATS OBJECT')
    return statsObject
}

const calculateIncrementedStats = () => {
    const incrementedStatsObject = {
        str: characterCopy.incrementedStr,
        dex: characterCopy.incrementedDex,
        agi: characterCopy.incrementedAgi
    }
    return incrementedStatsObject
}
const calculateTotalStats = () => {
    let equipmentStats = calculcateStatsFromEquipment()
    let cStats = classStatsCopy
    let rStats = raceStatsCopy
    let incrementedStats = calculateIncrementedStats()
    let totalStatsObject = {}
    console.log(characterCopy, ' CHARACTER COPY')
    console.log(equipmentStats, ' EQUIPMENTSTATS')
    console.log(cStats, 'CLASS STATS COPY')
    console.log(classStats, '+++++++++++++++++')
    console.log(rStats, ' RACE STATS COPY')
    console.log(incrementedStats, ' INCREMENTED CHARACTER COPY STATS')
    let stats = ['str', 'dex', 'agi']
    stats.forEach(stat => {
        totalStatsObject[stat] = equipmentStats[stat] + cStats[stat] + rStats[stat] + incrementedStats[stat]
    })
    console.log(totalStatsObject)
    return totalStatsObject
}
const totalStats = calculateTotalStats()

    const totalStatsFromGear = () => {
        let statsObject = {
            baseStr: 0,
            baseDex: 0,
            baseAgi: 0
        }
        for (const itemSlot in equippedItemsCopy) {
            let checkedEquipment = equippedItemsCopy[itemSlot]
            for (const stat in checkedEquipment) {
                if (stat === 'str') {statsObject.baseStr += checkedEquipment[stat]}
                if (stat === 'dex') {statsObject.baseDex += checkedEquipment[stat]}
                if (stat === 'agi') {statsObject.baseAgi += checkedEquipment[stat]}
            }
        }
        return statsObject
    }

    const calculateDamageObject = () => {
        if (!characterCopy) {
            return
        }
        let damageObject = {}
        let str = characterCopy.baseStr
        let dex = characterCopy.baseDex
        let agi = characterCopy.baseAgi
        let {weaponSlot1, weaponSlot2} = equippedItemsCopy

        if (characterCopy.weaponTypeEquipped === 'Onehanded') {
            let topMultiplier = 0.15 + characterCopy.oneHanded / 20
            let botMultiplier = 0.15 + characterCopy.oneHanded / 20
            damageObject.attackPower = Math.ceil((str + dex + (agi * 0.5)) * 0.5)
            damageObject.speed = Math.max(2, parseFloat((5.2 - Math.floor((characterCopy.oneHanded / 5) * 100) / 100).toFixed(1)))

            damageObject.botDamage1 = weaponSlot1 && damageObject.attackPower * (botMultiplier * weaponSlot1?.botDamage)
            damageObject.topDamage1 = weaponSlot1 && damageObject.attackPower * (topMultiplier * weaponSlot1?.topDamage)

            damageObject.botDamage2 = weaponSlot2 && damageObject.attackPower * (botMultiplier * weaponSlot2?.botDamage)
            damageObject.topDamage2 = weaponSlot2 && damageObject.attackPower * (topMultiplier * weaponSlot2?.topDamage)


            damageObject.totalDamageBot = parseFloat(((damageObject.botDamage1 || 0) + (damageObject.botDamage2 || 0)).toFixed(2))
            damageObject.totalDamageTop = parseFloat(((damageObject.topDamage1 || 0) + (damageObject.topDamage2 || 0)).toFixed(2))
            damageObject.totalAverageDamage = parseFloat(((damageObject.totalDamageBot + damageObject.totalDamageTop) / 2).toFixed(2))
            damageObject.totalDps = parseFloat((damageObject.totalAverageDamage / damageObject.speed).toFixed(1))

        }
        if (characterCopy.weaponTypeEquipped === 'Twohanded') {
            let topMultiplier = 0.15 + characterCopy.twoHanded / 20
            let botMultiplier = 0.15 + characterCopy.twoHanded / 20

            damageObject.attackPower = Math.ceil((str * 2) + ((dex + agi) * 0.5))
            damageObject.speed = Math.max(2, parseFloat((5.2 - Math.floor((characterCopy.twoHanded / 5) * 100) / 100).toFixed(1)))

            damageObject.botDamage1 = damageObject.attackPower * (botMultiplier * weaponSlot1?.botDamage)
            damageObject.topDamage1 = damageObject.attackPower * (topMultiplier * weaponSlot1?.topDamage)

            damageObject.totalDamageBot = parseFloat(((damageObject.botDamage1 || 0)).toFixed(2))
            damageObject.totalDamageTop = parseFloat(((damageObject.topDamage1 || 0)).toFixed(2))
            damageObject.totalAverageDamage = parseFloat(((damageObject.totalDamageBot + damageObject.totalDamageTop) / 2).toFixed(2))
            damageObject.totalDps = parseFloat((damageObject.totalAverageDamage / damageObject.speed).toFixed(1))
        }
        return damageObject
    }

    const totalDamages = () => {
        let damageObject = calculateDamageObject()
        return (
            <div className='total-damages'>
                <h5>Damage Range</h5>
                <span className='damage damage-range'>{damageObject.totalDamageBot ? damageObject?.totalDamageBot + ' - ' + damageObject?.totalDamageTop : 0}</span>
                <h5>Average Damage</h5>
                <span className='damage average-damage'>
                    {damageObject.totalAverageDamage ? damageObject.totalAverageDamage : 0}
                    </span>
                <h5>DPS</h5>
                <span className='damage dps'>{damageObject.totalDps ? damageObject.totalDps : 0}</span>
            </div>
        )
    }

    const showWarning = (e, message) => {
        const warningMessage = document.createElement('span')
        warningMessage.classList.add('warning-message')
        warningMessage.innerText = message;
        warningMessage.style.left = `${e.clientX - 200}px`;
        warningMessage.style.top = `${e.clientY - 35}px`;
        document.body.appendChild(warningMessage);
        setTimeout(() => {
            warningMessage.classList.add('fade-out');
        }, 1500); // Wait 1.5 seconds before starting fade out
        setTimeout(() => {
            setShowMessage(false)
            document.body.removeChild(warningMessage);
        }, 1700);
    }

    const handleDecrement = (e, stat) => {
        if (characterCopy[stat] - 1 < character[stat]) {
            if (showMessage === true) {return}
            const message = `You cannot lower a stat
             below your character's base 
             value`
            setShowMessage(true)
            showWarning(e, message)
            return
        }
        setCharacterCopy({...characterCopy, [stat]: characterCopy[stat] - 1})
        setIncrementStats({...incrementStats, [stat]: incrementStats[stat] - 1})
    }
    const handleIncrement = (stat) => {
        setCharacterCopy({...characterCopy, [stat]: characterCopy[stat] + 1})
        setIncrementStats({...incrementStats, [stat]: incrementStats[stat] + 1})
    }

    const handleClassSelect = (e) => {
        console.log(character)
        const characterClass = e?.target.value ? e.target.value : character.class
        if (characterClass === 'none' || characterClass === undefined) {
            setClassStatsCopy({str: 0, dex: 0, agi: 0, characterClass: 'none'})
            setCharacterCopy({...characterCopy, classStatsId: 0})
            // setCharacterCopy({...characterCopy, class: 'none', classStatsId: 0})
        }
        if (characterClass === 'berserker') {
            setClassStatsCopy({str: 10, dex: 0, agi: 0, characterClass: 'berserker'})
            setCharacterCopy({...characterCopy, classStatsId: 1})
            // setCharacterCopy({...characterCopy, class: 'berserker', classStatsId: 1})
        }
        if (characterClass === 'fighter') {
            setClassStatsCopy({str: 5, dex: 5, agi: 0, characterClass: 'fighter'})
            setCharacterCopy({...characterCopy, classStatsId: 2})
            // setCharacterCopy({...characterCopy, class: 'fighter', classStatsId: 2})
        }
        if (characterClass === 'assassin') {
            setClassStatsCopy({str: 0, dex: 5, agi: 5, characterClass: 'assassin'})
            setCharacterCopy({...characterCopy, classStatsId: 3})
            // setCharacterCopy({...characterCopy, class: 'assassin', classStatsId: 3})
        }
    }

    const handleRaceSelect = (e) => {
        const characterRace = e?.target.value ? e.target.value : character.race
        if (characterRace === 'none' || characterRace === undefined) {
            setRaceStatsCopy({baseStr: 0, baseDex: 0, baseAgi: 0})
            setCharacterCopy({...characterCopy, raceId: 1})
        }
        if (characterRace === 'human') {
            setRaceStatsCopy({baseStr: 1, baseDex: 1, baseAgi: 0})
            setCharacterCopy({...characterCopy, raceId: 2})
        }
        if (characterRace === 'elf') {
            setRaceStatsCopy({baseStr: 0, baseDex: 1, baseAgi: 1})
            setCharacterCopy({...characterCopy, raceId: 3})
        }
        if (characterRace === 'half-elf') {
            setRaceStatsCopy({baseStr: 1, baseDex: 0, baseAgi: 1})
            setCharacterCopy({...characterCopy, raceId: 4})
        }
        if (characterRace === 'half-minotaur') {
            setRaceStatsCopy({baseStr: 2, baseDex: 0, baseAgi: 0})
            setCharacterCopy({...characterCopy, raceId: 5})
        }
    }

    const handleSaveCharacter = () => {
        window.alert('character saved!')
        return fetch(`http://localhost:8088/characters/${selectedCharacterId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(characterCopy)
        }).then(res => res.json())
    }

    return (
        <div className='character-builder'>
            <h2>{character && character.name}</h2>
            <div className='builders'>
                <div className='left-builder col-6'>
                    <select className='class-select' value={characterCopy.class} onChange={handleClassSelect}>
                        <option value='none'>none</option>
                        <option value='berserker'>berserker</option>
                        <option value='fighter'>fighter</option>
                        <option value='assassin'>assassin</option>
                    </select>
                    <select className='race-select' value={characterCopy.race} onChange={handleRaceSelect}>
                        <option value='none'>none</option>
                        <option value='human'>human</option>
                        <option value='elf'>elf</option>
                        <option value='half-elf'>half-elf</option>
                        <option value='half-minotaur'>half-minotaur</option>
                    </select>
                    <ul className='attributes'>
                        <li className='d-flex'>
                            <span className='attribute-string'>STR:</span>
                            <button className='decrement-button' onClick={(e) => {handleDecrement(e, 'baseStr')}}>-</button>
                            <span className='attribute-number'>{totalStats.str}</span>
                            <button onClick={() => {handleIncrement('baseStr')}}>+</button>
                        </li>
                        <li className='d-flex'>
                            <span className='attribute-string'>DEX:</span>
                            <button className='decrement-button' onClick={(e) => {handleDecrement(e, 'baseDex')}}>-</button>
                            <span className='attribute-number'>{totalStats.dex}</span>
                            <button onClick={() => {handleIncrement('baseDex')}}>+</button>
                        </li>
                        <li className='d-flex'>
                            <span className='attribute-string'>AGI:</span>
                            <button className='decrement-button' onClick={(e) => {handleDecrement(e, 'baseAgi')}}>-</button>
                            <span className='attribute-number'>{totalStats.agi}</span>
                            <button onClick={() => {handleIncrement('baseAgi')}}>+</button>
                        </li>
                        {/* <li className='d-flex'>
                            <span className='attribute-string'>AGI:</span>
                            <button className='decrement-button' onClick={handleDecrement}>-</button>
                            <span className='attribute-number'>{characterCopy?.baseStr}</span>
                            <button onClick={handleIncrement}>+</button>
                        </li>
                        <li className='d-flex'>
                            <span className='attribute-string'>AGI:</span>
                            <button className='decrement-button'>-</button>
                            <span className='attribute-number'>{characterCopy?.baseStr}</span>
                            <button>+</button>
                        </li>
                        <li className='d-flex'>
                            <span className='attribute-string'>AGI:</span>
                            <button className='decrement-button'>-</button>
                            <span className='attribute-number'>{characterCopy?.baseStr}</span>
                            <button>+</button>
                        </li>
                        <li className='d-flex'>
                            <span className='attribute-string'>AGI:</span>
                            <button className='decrement-button'>-</button>
                            <span className='attribute-number'>{characterCopy?.baseStr}</span>
                            <button>+</button>
                        </li> */}
                    </ul>
                    <p className=''>Attackpower: {calculateDamageObject().attackPower}</p>
                </div>
                <div className='right-builder col-6'>
                    <h4>Weapon Skills</h4>
                    <div className='weapon-skills'>
                        <p className={characterCopy.weaponTypeEquipped === 'Onehanded' ? 'selected-weapon-skill' : ''}>Onehanded</p>
                        <p>{characterCopy.oneHanded}</p>
                        <p className={characterCopy.weaponTypeEquipped === 'Twohanded' ? 'selected-weapon-skill' : ''}>Twohanded</p>
                        <p>{characterCopy.oneHanded}</p>
                    </div>
                </div>
            </div>
            <div>
            <h4>Equipment</h4>
            <div className='item-container'>
                {equippedItemsCopy.weaponSlot1 ?
                <div className='equipment col-3'>
                    <h6 style={{color: equippedItemsCopy.weaponSlot1.color}}>{equippedItemsCopy.weaponSlot1.name}</h6>
                    <p>Damage: {equippedItemsCopy.weaponSlot1.botDamage + ' - ' + equippedItemsCopy.weaponSlot1.topDamage}</p>
                    <p>Str: {equippedItemsCopy.weaponSlot1.str}</p>
                    <p>Dex: {equippedItemsCopy.weaponSlot1.dex}</p>
                    <p>Agi: {equippedItemsCopy.weaponSlot1.agi}</p>
                 </div> : <div className='equipment col-3'></div>
                 }
                {equippedItemsCopy.weaponSlot2 ?
                <div className='equipment col-3'>
                    <h6 style={{color: equippedItemsCopy.weaponSlot2.color}}>{equippedItemsCopy.weaponSlot2.name}</h6>
                    <p>Damage: {equippedItemsCopy.weaponSlot2.botDamage + ' - ' + equippedItemsCopy.weaponSlot2.topDamage}</p>
                    <p>Str: {equippedItemsCopy.weaponSlot2.str}</p>
                    <p>Dex: {equippedItemsCopy.weaponSlot2.dex}</p>
                    <p>Agi: {equippedItemsCopy.weaponSlot2.agi}</p>
                 </div> : <div className='equipment col-3'></div>
                 }
                        {/* {itemSelectorWeapons[0] && 
                            <div className='equipment col-3'>
                                <h6 style={{color: itemSelectorWeapons[0].color}}>{itemSelectorWeapons[0].name}</h6>
                                <p>Damage: {itemSelectorWeapons[0].botDamage + ' - ' + itemSelectorWeapons[0].topDamage}</p>
                                <p>Str: {itemSelectorWeapons[0].str ? itemSelectorWeapons[0].str : ''}</p>
                                <p>Dex: {itemSelectorWeapons[0].dex ? itemSelectorWeapons[0].dex : ''}</p>
                                <p>Agi: {itemSelectorWeapons[0].agi ? itemSelectorWeapons[0].agi : ''}</p>
                            </div>
                        }
                        {itemSelectorWeapons[1] && 
                            <div className='equipment col-3'>
                                <h6 style={{color: itemSelectorWeapons[1].color}}>{itemSelectorWeapons[1].name}</h6>
                                <p>Damage: {itemSelectorWeapons[1].botDamage + ' - ' + itemSelectorWeapons[1].topDamage}</p>
                                <p>Str: {itemSelectorWeapons[1].str ? itemSelectorWeapons[1].str : ''}</p>
                                <p>Dex: {itemSelectorWeapons[1].dex ? itemSelectorWeapons[1].dex : ''}</p>
                                <p>Agi: {itemSelectorWeapons[1].agi ? itemSelectorWeapons[1].agi : ''}</p>
                            </div>
                        } */}
            </div>

            </div>
            <div className='character-builder-damage'>
                {totalDamages()}
            </div>
            <div>
                <button onClick={handleSaveCharacter}>Save Character</button>
            </div>
        </div>
    )
}