import { useState, useEffect } from "react"
import { getCharacterById } from "../../services/characterServices"
import { getEquippedWeapons } from "../../services/characterServices"
import { getSelectedWeapons } from "../../services/itemServices"
import './CharacterBuilder.css'

export const CharacterBuilder = ({ currentUser, selectedCharacterId, setSelectedCharacterId, character, 
    characterCopy, setCharacter, setCharacterCopy, equippedItems, setEquippedItems, equippedItemsCopy,
    setEquippedItemsCopy }) => {
    const [equippedWeapons, setEquippedWeapons] = useState([])
    const [showMessage, setShowMessage] = useState(false)
    const [classStats, setClassStats] = useState({baseStr: 0, baseDex: 0, baseAgi: 0})
    const [raceStats, setRaceStats] = useState({baseStr: 0, baseDex: 0, baseAgi: 0})
    const [incrementStats, setIncrementStats] = useState({baseStr: 0, baseDex: 0, baseAgi: 0})

    //update the character with new base values
    useEffect(() => {
        let combinedBaseStats = {}
        let combinedAllStats = {}

        for (const stat in classStats) {
            let classStat = classStats[stat] ? classStats[stat] : 0
            let raceStat = raceStats[stat] ? raceStats[stat] : 0
            combinedBaseStats[stat] = classStat + raceStat
        }
        for (const stat in classStats) {
            let classStat = classStats[stat] ? classStats[stat] : 0
            let raceStat = raceStats[stat] ? raceStats[stat] : 0
            let incrementStat = incrementStats[stat] ? incrementStats[stat] : 0
            combinedAllStats[stat] = classStat + raceStat + incrementStat
        }
        setCharacter({...character, ...combinedBaseStats})
        setCharacterCopy({...characterCopy, ...combinedAllStats})
    }, [classStats, raceStats])

    const calculateDamageObject = () => {
        if (!characterCopy) {
            return
        }
        let damageObject = {}
        let str = characterCopy.baseStr
        let dex = characterCopy.baseDex
        let agi = characterCopy.baseAgi
        let {weaponSlot1, weaponSlot2} = equippedItemsCopy
        console.log(weaponSlot1)
        if (weaponSlot1) {
            str += weaponSlot1.str
            dex += weaponSlot1.dex
            agi += weaponSlot1.agi
        }
        if (weaponSlot2) {
            str += weaponSlot2.str
            dex += weaponSlot2.dex
            agi += weaponSlot2.agi
        }

        if (characterCopy.weaponTypeEquipped === 'Onehanded') {
            let topMultiplier = 0.15 + characterCopy.oneHanded / 20
            let botMultiplier = 0.15 + characterCopy.oneHanded / 20
            damageObject.attackPower = Math.ceil((str + dex + (agi * 0.5)) * 0.5)
            damageObject.speed = Math.max(2, parseFloat((5.2 - Math.floor((characterCopy.oneHanded / 5) * 100) / 100).toFixed(1)))
            damageObject.topDamage1 = Math.ceil(damageObject.attackPower * (topMultiplier * weaponSlot1?.topDamage))
            damageObject.botDamage1 = Math.ceil(damageObject.attackPower * (botMultiplier * weaponSlot1?.botDamage))
            damageObject.topDamage2 = weaponSlot2 && Math.ceil(damageObject.attackPower * (topMultiplier * weaponSlot2?.topDamage))
            damageObject.botDamage2 = weaponSlot2 && Math.ceil(damageObject.attackPower * (botMultiplier * weaponSlot2?.botDamage))
            console.log(weaponSlot1)
        }
        if (characterCopy.weaponTypeEquipped === 'Twohanded') {
            let topMultiplier = 0.15 + characterCopy.twoHanded / 20
            let botMultiplier = 0.15 + characterCopy.twoHanded / 20
            damageObject.attackPower = Math.ceil((str * 2) + ((dex + agi) * 0.5))
            damageObject.speed = Math.max(2, parseFloat((5.2 - Math.floor((characterCopy.twoHanded / 5) * 100) / 100).toFixed(1)))
            damageObject.topDamage1 = Math.ceil(damageObject.attackPower * (topMultiplier * equippedItemsCopy[0]?.item.topDamage))
            damageObject.botDamage1 = Math.ceil(damageObject.attackPower * (botMultiplier * equippedItemsCopy[0]?.item.botDamage))
        }
        return damageObject







        // equippedItems.forEach(item => {
        //     if (item.item.str != null) {str += item.item.str}
        //     if (item.item.dex != null) {dex += item.item.dex}
        //     if (item.item.agi != null) {agi += item.item.agi}
        // })
        // if (characterCopy.weaponTypeEquipped === 'Onehanded') {
        //     let topMultiplier = 0.15 + characterCopy.oneHanded / 20
        //     let botMultiplier = 0.15 + characterCopy.oneHanded / 20
        //     damageObject.attackPower = Math.ceil((str + dex + (agi * 0.5)) * 0.5)
        //     damageObject.speed = Math.max(2, parseFloat((5.2 - Math.floor((characterCopy.oneHanded / 5) * 100) / 100).toFixed(1)))
        //     damageObject.topDamage1 = Math.ceil(damageObject.attackPower * (topMultiplier * equippedItemsCopy[0]?.item.topDamage))
        //     damageObject.botDamage1 = Math.ceil(damageObject.attackPower * (botMultiplier * equippedItemsCopy[0]?.item.botDamage))
        //     damageObject.topDamage2 = equippedItemsCopy[1] && Math.ceil(damageObject.attackPower * (topMultiplier * equippedItemsCopy[1].item.topDamage))
        //     damageObject.botDamage2 = equippedItemsCopy[1] && Math.ceil(damageObject.attackPower * (botMultiplier * equippedItemsCopy[1].item.botDamage))
        // }
        // if (characterCopy.weaponTypeEquipped === 'Twohanded') {
        //     let topMultiplier = 0.15 + characterCopy.twoHanded / 20
        //     let botMultiplier = 0.15 + characterCopy.twoHanded / 20
        //     damageObject.attackPower = Math.ceil((str * 2) + ((dex + agi) * 0.5))
        //     damageObject.speed = Math.max(2, parseFloat((5.2 - Math.floor((characterCopy.twoHanded / 5) * 100) / 100).toFixed(1)))
        //     damageObject.topDamage1 = Math.ceil(damageObject.attackPower * (topMultiplier * equippedItemsCopy[0]?.item.topDamage))
        //     damageObject.botDamage1 = Math.ceil(damageObject.attackPower * (botMultiplier * equippedItemsCopy[0]?.item.botDamage))
        // }
        // return damageObject
    }

    const totalDamages = () => {
        console.log(calculateDamageObject())
        return (
            <div className='total-damages'>
                <h5>Damage Range</h5>
                <span className='damage damage-range'>{calculateDamageObject()?.botDamage1 + ' - ' + calculateDamageObject()?.topDamage1}</span>
                <h5>Average Damage</h5>
                <span className='damage average-damage'>
                    {Math.ceil((calculateDamageObject()?.botDamage1 + calculateDamageObject()?.topDamage1) * 0.5)}
                    </span>
                <h5>DPS</h5>
                <span className='damage dps'>{(Math.ceil(((calculateDamageObject()?.botDamage1 + calculateDamageObject()?.topDamage1) * 0.5)) / calculateDamageObject()?.speed).toFixed(1)}</span>
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
        const characterClass = e?.target.value ? e.target.value : character.class
        if (characterClass === 'None' || characterClass === undefined) {
            setClassStats({baseStr: 0, baseDex: 0, baseAgi: 0})
            setCharacterCopy({...characterCopy, class: 'None'})
        }
        if (characterClass === 'Berserker') {
            setClassStats({baseStr: 10, baseDex: 0, baseAgi: 0})
            setCharacterCopy({...characterCopy, class: 'Berserker'})
        }
        if (characterClass === 'Fighter') {
            setClassStats({baseStr: 5, baseDex: 5, baseAgi: 0})
            setCharacterCopy({...characterCopy, class: 'Fighter'})
        }
        if (characterClass === 'Assassin') {
            setClassStats({baseStr: 0, baseDex: 5, baseAgi: 5})
            setCharacterCopy({...characterCopy, class: 'Assassin'})
        }
    }
    const handleRaceSelect = (e) => {
        const characterRace = e?.target.value ? e.target.value : character.race
        if (characterRace === 'None' || characterRace === undefined) {
            setRaceStats({baseStr: 0, baseDex: 0, baseAgi: 0})
            setCharacterCopy({...characterCopy, race: 'None'})
        }
        if (characterRace === 'Human') {
            setRaceStats({baseStr: 1, baseDex: 1, baseAgi: 0})
            setCharacterCopy({...characterCopy, race: 'Human'})
        }
        if (characterRace === 'Elf') {
            setRaceStats({baseStr: 0, baseDex: 1, baseAgi: 1})
            setCharacterCopy({...characterCopy, race: 'Elf'})
        }
        if (characterRace === 'Half-Elf') {
            setRaceStats({baseStr: 1, baseDex: 0, baseAgi: 1})
            setCharacterCopy({...characterCopy, race: 'Half-Elf'})
        }
        if (characterRace === 'Half-Minotaur') {
            setRaceStats({baseStr: 2, baseDex: 0, baseAgi: 0})
            setCharacterCopy({...characterCopy, race: 'Half-Minotaur'})
        }
    }

    const mapItemObject = () => {
        for (const item of equippedItemsCopy) {

        }
    }


    return (
        <div className='character-builder'>
            <h2>{character && character.name}</h2>
            <div className='builders'>
                <div className='left-builder col-6'>
                    <select className='class-select' value={characterCopy.class} onChange={handleClassSelect}>
                        <option value='None'>None</option>
                        <option value='Berserker'>Berserker</option>
                        <option value='Fighter'>Fighter</option>
                        <option value='Assassin'>Assassin</option>
                    </select>
                    <select className='race-select' value={characterCopy.race} onChange={handleRaceSelect}>
                        <option value='None'>None</option>
                        <option value='Human'>Human</option>
                        <option value='Elf'>Elf</option>
                        <option value='Half-Elf'>Half-Elf</option>
                        <option value='Half-Minotaur'>Half-Minotaur</option>
                    </select>
                    <ul className='attributes'>
                        <li className='d-flex'>
                            <span className='attribute-string'>STR:</span>
                            <button className='decrement-button' onClick={(e) => {handleDecrement(e, 'baseStr')}}>-</button>
                            <span className='attribute-number'>{characterCopy?.baseStr}</span>
                            <button onClick={() => {handleIncrement('baseStr')}}>+</button>
                        </li>
                        <li className='d-flex'>
                            <span className='attribute-string'>DEX:</span>
                            <button className='decrement-button' onClick={(e) => {handleDecrement(e, 'baseDex')}}>-</button>
                            <span className='attribute-number'>{characterCopy?.baseDex}</span>
                            <button onClick={() => {handleIncrement('baseDex')}}>+</button>
                        </li>
                        <li className='d-flex'>
                            <span className='attribute-string'>AGI:</span>
                            <button className='decrement-button' onClick={(e) => {handleDecrement(e, 'baseAgi')}}>-</button>
                            <span className='attribute-number'>{characterCopy?.baseAgi}</span>
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
                        <p>Onehanded</p>
                        <p>Twohanded</p>
                    </div>
                </div>
            </div>
            <div>
            <h4>Equipment</h4>
            <div className='item-container'>
                {equippedItemsCopy.weaponSlot1 && <p>STR: {equippedItemsCopy.weaponSlot1.str}</p>}
                {equippedItems ? equippedItems.map(item => {
                    return (
                        <div className='equipment col-3'>
                            <h6 style={{color: item.item.color}}>{item.item.name}</h6>
                            <p>Damage: {item.item.botDamage + ' - ' + item.item.topDamage}</p>
                            <p>Str: {item ? item.itemstr : ''}</p>
                            <p>Dex: {item ? item.item.dex : ''}</p>
                            <p>Agi: {item ? item.item.agi : ''}</p>
                        </div>
                    )
                }) : ''}
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
        </div>
    )
}