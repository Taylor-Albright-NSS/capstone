import { useState, useEffect } from "react"
import { getCharacterById } from "../../services/characterServices"
import { getEquippedWeapons } from "../../services/characterServices"
import { CharacterSheet } from "character-sheet"
import { getCharacterClassAndRaceStats } from "../../services/statsServices"
import './CharacterBuilder.css'

export const CharacterBuilder = ({ currentUser, selectedCharacterId, setSelectedCharacterId, character, 
    characterCopy, setCharacter, setCharacterCopy, equippedItems, setEquippedItems, equippedItemsCopy,
    setEquippedItemsCopy, classStats, setClassStats, raceStats, setRaceStats, classStatsCopy, setClassStatsCopy,
    raceStatsCopy, setRaceStatsCopy }) => {
    const [equippedWeapons, setEquippedWeapons] = useState([])
    const [showMessage, setShowMessage] = useState(false)
    const [incrementStats, setIncrementStats] = useState({str: 0, dex: 0, agi: 0})
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
        console.log(equippedItemsCopy, ' EQUIPPED ITEMS USE EFFECT')
    }, [classStats, raceStats, equippedItemsCopy])

    useEffect(() => {
        getCharacterClassAndRaceStats(selectedCharacterId).then(stats => {
            // setRaceStatsCopy({...stats[0].raceStats})
        })    
    }, [characterCopy])

const totalStatsFromGear = () => {
    let statsObject = {
        str: 0,
        dex: 0,
        agi: 0
    }
    for (const itemSlot in equippedItemsCopy) {
        let checkedEquipment = equippedItemsCopy[itemSlot]
        for (const stat in checkedEquipment) {
            if (stat === 'str') {statsObject.str += checkedEquipment[stat]}
            if (stat === 'dex') {statsObject.dex += checkedEquipment[stat]}
            if (stat === 'agi') {statsObject.agi += checkedEquipment[stat]}
        }
    }
    console.log(statsObject)
    return statsObject
}

const calculateIncrementedStats = () => {
    const totalStatsObject = {
        str: incrementStats.str,
        dex: incrementStats.dex,
        agi: incrementStats.agi
    }
    return totalStatsObject
}
const calculateTotalStats = () => {
    let equipmentStats = totalStatsFromGear()
    let cStats = classStatsCopy
    let rStats = raceStatsCopy
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



    const totalStatsFromClassAndRace = () => {
        let statsObject = {
            str: classStatsCopy.str + raceStatsCopy.str ,
            dex: classStatsCopy.dex + raceStatsCopy.dex ,
            agi: classStatsCopy.agi + raceStatsCopy.agi 
        }
        console.log(statsObject)
        return statsObject
    }
    const totalStatsFromClassAndRaceAndGear = () => {
        let statsObject = {
            str: classStatsCopy.str + raceStatsCopy.str + totalStatsFromGear().str ,
            dex: classStatsCopy.dex + raceStatsCopy.dex + totalStatsFromGear().dex,
            agi: classStatsCopy.agi + raceStatsCopy.agi + totalStatsFromGear().agi
        }
        console.log(statsObject)
        return statsObject
    }

    const calculateDamageObject = () => {
        const totalStats = calculateTotalStats()
        if (!characterCopy) {
            return
        }
        let damageObject = {}
        let str = totalStats.str
        let dex = totalStats.dex
        let agi = totalStats.agi

        let slot1 = equippedItemsCopy[0]
        let slot2 = equippedItemsCopy[1]
        console.log(slot1)
        console.log(slot2)

        if (characterCopy.weaponTypeEquipped === 'onehanded') {
            let topMultiplier = 0.15 + characterCopy.oneHanded / 20
            let botMultiplier = 0.15 + characterCopy.oneHanded / 20
            damageObject.attackPower = Math.ceil((str + dex + (agi * 0.5)) * 0.5)
            damageObject.speed = Math.max(2, parseFloat((5.2 - Math.floor((characterCopy.oneHanded / 5) * 100) / 100).toFixed(1)))

            damageObject.botDamage1 = slot1 && damageObject.attackPower * (botMultiplier * slot1?.item?.botDamage)
            damageObject.topDamage1 = slot1 && damageObject.attackPower * (topMultiplier * slot1?.item?.topDamage)

            damageObject.botDamage2 = slot2 && damageObject.attackPower * (botMultiplier * slot2?.item?.botDamage)
            damageObject.topDamage2 = slot2 && damageObject.attackPower * (topMultiplier * slot2?.item?.topDamage)

            damageObject.totalDamageBot = parseFloat(((damageObject.botDamage1 || 0) + (damageObject.botDamage2 || 0)).toFixed(2))
            damageObject.totalDamageTop = parseFloat(((damageObject.topDamage1 || 0) + (damageObject.topDamage2 || 0)).toFixed(2))
            damageObject.totalAverageDamage = parseFloat(((damageObject.totalDamageBot + damageObject.totalDamageTop) / 2).toFixed(2))
            damageObject.totalDps = parseFloat((damageObject.totalAverageDamage / damageObject.speed).toFixed(1))
            console.log(damageObject)
        }
        if (characterCopy.weaponTypeEquipped === 'twohanded') {
            let topMultiplier = 0.15 + characterCopy.twoHanded / 20
            let botMultiplier = 0.15 + characterCopy.twoHanded / 20

            damageObject.attackPower = Math.ceil((str * 2) + ((dex + agi) * 0.5))
            damageObject.speed = Math.max(2, parseFloat((5.2 - Math.floor((characterCopy.twoHanded / 5) * 100) / 100).toFixed(1)))

            damageObject.botDamage1 = damageObject.attackPower * (botMultiplier * slot1?.item?.botDamage)
            damageObject.topDamage1 = damageObject.attackPower * (topMultiplier * slot1?.item?.topDamage)

            damageObject.totalDamageBot = parseFloat(((damageObject.botDamage1 || 0)).toFixed(2))
            damageObject.totalDamageTop = parseFloat(((damageObject.topDamage1 || 0)).toFixed(2))
            damageObject.totalAverageDamage = parseFloat(((damageObject.totalDamageBot + damageObject.totalDamageTop) / 2).toFixed(2))
            damageObject.totalDps = parseFloat((damageObject.totalAverageDamage / damageObject.speed).toFixed(1))
            console.log(damageObject)

        }
        return damageObject
    }

    const totalDamages = () => {
        let damageObject = calculateDamageObject()
        console.log(damageObject)
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
        let statsObject = totalStatsFromClassAndRaceAndGear()
        if (totalStats[stat] <= statsObject[stat]) {
            if (showMessage === true) {return}
            const message = `Your stats have been
            lowered below the total of
            your class, race, and gear
            totals`
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
            setCharacterCopy({...characterCopy, classStatsId: 1, class: 'none'})
            // setCharacterCopy({...characterCopy, class: 'none', classStatsId: 0})
        }
        if (characterClass === 'berserker') {
            setClassStatsCopy({str: 10, dex: 0, agi: 0, characterClass: 'berserker'})
            setCharacterCopy({...characterCopy, classStatsId: 2, class: 'berserker'})
            // setCharacterCopy({...characterCopy, class: 'berserker', classStatsId: 1})
        }
        if (characterClass === 'fighter') {
            setClassStatsCopy({str: 5, dex: 5, agi: 0, characterClass: 'fighter'})
            setCharacterCopy({...characterCopy, classStatsId: 3, class: 'fighter'})
            // setCharacterCopy({...characterCopy, class: 'fighter', classStatsId: 2})
        }
        if (characterClass === 'assassin') {
            setClassStatsCopy({str: 0, dex: 5, agi: 5, characterClass: 'assassin'})
            setCharacterCopy({...characterCopy, classStatsId: 4, class: 'assassin'})
            // setCharacterCopy({...characterCopy, class: 'assassin', classStatsId: 3})
        }
    }

    const handleRaceSelect = (e) => {
        const characterRace = e?.target.value ? e.target.value : character.race
        if (characterRace === 'none' || characterRace === undefined) {
            setRaceStatsCopy({str: 0, dex: 0, agi: 0, raceName: 'none'})
            setCharacterCopy({...characterCopy, raceStatsId: 1, race: 'none'})
        }
        if (characterRace === 'human') {
            setRaceStatsCopy({str: 1, dex: 1, agi: 0, raceName: 'human'})
            setCharacterCopy({...characterCopy, raceStatsId: 2, race: 'human'})
        }
        if (characterRace === 'elf') {
            setRaceStatsCopy({str: 0, dex: 1, agi: 1, raceName: 'elf'})
            setCharacterCopy({...characterCopy, raceStatsId: 3, race: 'elf'})
        }
        if (characterRace === 'half-elf') {
            setRaceStatsCopy({str: 1, dex: 0, agi: 1, raceName: 'half-elf'})
            setCharacterCopy({...characterCopy, raceStatsId: 4, race: 'half-elf'})
        }
        if (characterRace === 'half-minotaur') {
            setRaceStatsCopy({str: 2, dex: 0, agi: 0, raceName: 'half-minotaur'})
            setCharacterCopy({...characterCopy, raceStatsId: 5, race: 'half-minotaur'})
        }
    }

    // const handleSaveCharacter = async () => {
    //     for (const index in equippedItemsCopy) {
    //         const item = {...equippedItemsCopy[index]}
    //         console.log(item)
    //         item.characterId = selectedCharacterId
    //         item.itemId = item.item.id
    //         item.slotId = item.item.slotId

    //         const response = await fetch(`http://localhost:8088/character_items?id=${item.id}`);
    //         const data = await response.json()
    //         delete item.item
    //         console.log(data, ' DATA DATA DATA')
    //         if (data.length > 0) {
    //             console.log('PUT PUT PUT PUT')
    //             await fetch(`http://localhost:8088/character_items/${item.id}`, {
    //                 method: "PUT",
    //                 headers: {
    //                     "Content-Type": "application/json",
    //                 },
    //                 body: JSON.stringify(item)
    //             })
    //         } else {
    //             console.log('POST POST POST POST')
    //             const newItemResponse = await fetch(`http://localhost:8088/character_items/`, {
    //                 method: "POST",
    //                 headers: {
    //                     "Content-Type": "application/json",
    //                 },
    //                 body: JSON.stringify(item)
    //             })
    //             const newItemData = await newItemResponse.json()
    //             console.log(index)
    //             console.log(item, ' ITEM ITEM ITEM')
    //             console.log(newItemData, ' NEW ITEM DATA')
    //             console.log(newItemData?.id, ' NEW ITEM DATA ID')
    //             console.log({...equippedItemsCopy[index]}, ' EQUIPPED ITEMS COPY')
    //             await setEquippedItemsCopy({...equippedItemsCopy, [index]: {...equippedItemsCopy[index], id: newItemData.id}})
    //         }
    //     }
    // }

    const handleSaveCharacter = async () => {
        // Create a new array to hold the updated items
        const updatedItems = {...equippedItemsCopy};
    
        for (const index in equippedItemsCopy) {
            const item = { ...equippedItemsCopy[index] };
            console.log(item);
            item.characterId = selectedCharacterId;
            item.itemId = item.item.id;
            item.slotId = item.item.slotId;
    
            const response = await fetch(`http://localhost:8088/character_items?id=${item.id}`);
            const data = await response.json();
            delete item.item;
            console.log(data, ' DATA DATA DATA');
    
            if (data.length > 0) {
                console.log('PUT PUT PUT PUT');
                await fetch(`http://localhost:8088/character_items/${item.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(item),
                });
            } else {
                console.log('POST POST POST POST');
                const newItemResponse = await fetch(`http://localhost:8088/character_items/`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(item),
                });
                const newItemData = await newItemResponse.json();
                console.log(index);
                console.log(item, ' ITEM ITEM ITEM');
                console.log(newItemData, ' NEW ITEM DATA');
                console.log(newItemData?.id, ' NEW ITEM DATA ID');
                console.log({ ...equippedItemsCopy[index] }, ' EQUIPPED ITEMS COPY');
    
                // Use the newItemData.id to update the correct index in the new array
                updatedItems[index] = { ...equippedItemsCopy[index], id: newItemData.id };
            }
        }
    
        // Set the new state outside the loop to avoid mutability issues
        await setEquippedItemsCopy(updatedItems);
    };
    

    

    return (
        <div className='character-builder'>
            <h2>{character && character.name}</h2>
            <div className='builders'>
                <div className='left-builder col-6'>
                    <select className='class-select' value={classStatsCopy.characterClass} onChange={handleClassSelect}>
                        <option value='none'>none</option>
                        <option value='berserker'>berserker</option>
                        <option value='fighter'>fighter</option>
                        <option value='assassin'>assassin</option>
                    </select>
                    <select className='race-select' value={raceStatsCopy.raceName} onChange={handleRaceSelect}>
                        <option value='none'>none</option>
                        <option value='human'>human</option>
                        <option value='elf'>elf</option>
                        <option value='half-elf'>half-elf</option>
                        <option value='half-minotaur'>half-minotaur</option>
                    </select>
                    <ul className='attributes'>
                        <li className='d-flex'>
                            <span className='attribute-string'>STR:</span>
                            <button className='decrement-button' onClick={(e) => {handleDecrement(e, 'str')}}>-</button>
                            <span className='attribute-number'>{totalStats.str}</span>
                            <button onClick={() => {handleIncrement('str')}}>+</button>
                        </li>
                        <li className='d-flex'>
                            <span className='attribute-string'>DEX:</span>
                            <button className='decrement-button' onClick={(e) => {handleDecrement(e, 'dex')}}>-</button>
                            <span className='attribute-number'>{totalStats.dex}</span>
                            <button onClick={() => {handleIncrement('dex')}}>+</button>
                        </li>
                        <li className='d-flex'>
                            <span className='attribute-string'>AGI:</span>
                            <button className='decrement-button' onClick={(e) => {handleDecrement(e, 'agi')}}>-</button>
                            <span className='attribute-number'>{totalStats.agi}</span>
                            <button onClick={() => {handleIncrement('agi')}}>+</button>
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
                        <p className={characterCopy.weaponTypeEquipped === 'onehanded' ? 'selected-weapon-skill' : ''}>Onehanded</p>
                        <p>{characterCopy.oneHanded}</p>
                        <p className={characterCopy.weaponTypeEquipped === 'twohanded' ? 'selected-weapon-skill' : ''}>Twohanded</p>
                        <p>{characterCopy.oneHanded}</p>
                    </div>
                </div>
            </div>
            <div>
            <h4>Equipment</h4>
            <div className='item-container'>
                {equippedItemsCopy[0]?.item ?
                <div className='equipment col-3'>
                    <h6 style={{color: equippedItemsCopy[0].item.color}}>{equippedItemsCopy[0].item.name}</h6>
                    <p>Damage: {equippedItemsCopy[0].item.botDamage + ' - ' + equippedItemsCopy[0].item.topDamage}</p>
                    <p>Str: {equippedItemsCopy[0].item.str}</p>
                    <p>Dex: {equippedItemsCopy[0].item.dex}</p>
                    <p>Agi: {equippedItemsCopy[0].item.agi}</p>
                 </div> : <div className='equipment col-3'>Weapon slot 1</div>
                 }
                {equippedItemsCopy[1]?.item ?
                <div className='equipment col-3'>
                    <h6 style={{color: equippedItemsCopy[1].item.color}}>{equippedItemsCopy[1].item.name}</h6>
                    <p>Damage: {equippedItemsCopy[1].item.botDamage + ' - ' + equippedItemsCopy[1].item.topDamage}</p>
                    <p>Str: {equippedItemsCopy[1].item.str}</p>
                    <p>Dex: {equippedItemsCopy[1].item.dex}</p>
                    <p>Agi: {equippedItemsCopy[1].item.agi}</p>
                 </div> : <div className='equipment col-3'>Weapon slot 2</div>
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