import { useState, useEffect } from "react"
import { getCharacterById } from "../../services/characterServices"
import { getEquippedWeapons } from "../../services/characterServices"
import { getAllEquippedItems } from "../../services/itemServices"
import { CharacterSheet } from "../profile/CharacterSheet"
import { getCharacterClassAndRaceStats } from "../../services/statsServices"
import { getSingleItem } from "../../services/itemServices"
import { getAllEquippedItems3 } from "../../services/itemServices"
import './CharacterBuilder.css'

export const CharacterBuilder = ({ currentUser, selectedCharacterId, setSelectedCharacterId, character, 
    characterCopy, setCharacter, setCharacterCopy, equippedItems, setEquippedItems, equippedItemsCopy,
    setEquippedItemsCopy, classStats, setClassStats, raceStats, setRaceStats, classStatsCopy, setClassStatsCopy,
    raceStatsCopy, setRaceStatsCopy }) => {
    const [equippedWeapons, setEquippedWeapons] = useState([])
    const [showMessage, setShowMessage] = useState(false)
    const [incrementStats, setIncrementStats] = useState({str: 0, dex: 0, agi: 0})
    const [weaponSkillLevel, setWeaponSkillLevel] = useState({})
    const [statsFromGear, setStatsFromGear] = useState({str: 0, dex: 0, agi: 0})
    const [equipmentImages, setEquipmentImages] = useState([])

    useEffect(() => {
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
            let incrementStat = characterCopy[stat] ? characterCopy[stat] : 0
            let gearStat = statsFromGear[stat] ? statsFromGear[stat] : 0
            combinedAllStats[stat] = classStat + raceStat + incrementStat + gearStat
        }
    }, [classStats, raceStats, equippedItemsCopy])

    // useEffect(() => {
    //     getAllEquippedItems3(selectedCharacterId).then(equipmentArray => {
    //         setEquippedItemsCopy(equipmentArray)
    //     })
    // }, [])

    useEffect(() => {
        getCharacterClassAndRaceStats(selectedCharacterId).then(stats => {
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
        console.log(checkedEquipment.item)
        for (const stat in checkedEquipment.item) {
            if (stat === 'str') {
                console.log(checkedEquipment.item[stat])
                statsObject.str += checkedEquipment.item[stat]
            }
            if (stat === 'dex') {statsObject.dex += checkedEquipment.item[stat]}
            if (stat === 'agi') {statsObject.agi += checkedEquipment.item[stat]}
        }
    }
    console.log(statsObject)
    return statsObject
}

const calculateIncrementedStats = () => {
    const totalStatsObject = {
        str: characterCopy.str,
        dex: characterCopy.dex,
        agi: characterCopy.agi
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
        console.log(totalStats)
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
            damageObject.botDamage1 = slot1 && Math.ceil(damageObject.attackPower * (botMultiplier * slot1?.item?.botDamage))
            damageObject.topDamage1 = slot1 && Math.ceil(damageObject.attackPower * (topMultiplier * slot1?.item?.topDamage))
            damageObject.botDamage2 = slot2 && Math.ceil(damageObject.attackPower * (botMultiplier * slot2?.item?.botDamage))
            damageObject.topDamage2 = slot2 && Math.ceil(damageObject.attackPower * (topMultiplier * slot2?.item?.topDamage))

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
            damageObject.speed = Math.max(2, parseFloat((5.2 - Math.floor((characterCopy.twoHanded / 5) * 100) / 100).toFixed(0)))

            damageObject.botDamage1 = Math.ceil(damageObject.attackPower * (botMultiplier * slot1?.item?.botDamage))
            damageObject.topDamage1 = Math.ceil(damageObject.attackPower * (topMultiplier * slot1?.item?.topDamage))

            damageObject.totalDamageBot = parseFloat(((damageObject.botDamage1 || 0)).toFixed(0))
            damageObject.totalDamageTop = parseFloat(((damageObject.topDamage1 || 0)).toFixed(0))
            damageObject.totalAverageDamage = parseFloat(((damageObject.totalDamageBot + damageObject.totalDamageTop) / 2).toFixed(0))
            damageObject.totalDps = parseFloat((damageObject.totalAverageDamage / damageObject.speed).toFixed(1))
            console.log(damageObject)

        }
        console.log(damageObject)
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
            setRaceStatsCopy({str: 2, dex: 2, agi: 2, raceName: 'human'})
            setCharacterCopy({...characterCopy, raceStatsId: 2, race: 'human'})
        }
        if (characterRace === 'elf') {
            setRaceStatsCopy({str: 0, dex: 3, agi: 3, raceName: 'elf'})
            setCharacterCopy({...characterCopy, raceStatsId: 3, race: 'elf'})
        }
        if (characterRace === 'half-elf') {
            setRaceStatsCopy({str: 1, dex: 2, agi: 3, raceName: 'half-elf'})
            setCharacterCopy({...characterCopy, raceStatsId: 4, race: 'half-elf'})
        }
        if (characterRace === 'half-minotaur') {
            setRaceStatsCopy({str: 6, dex: 0, agi: 0, raceName: 'half-minotaur'})
            setCharacterCopy({...characterCopy, raceStatsId: 5, race: 'half-minotaur'})
        }
    }

    const handleSaveCharacter = async () => {
        // Create a new array to hold the updated items
        const updatedItems = {...equippedItemsCopy};
        let saveCheck = confirm('Are you sure you wish to save these changes?')
        if (!saveCheck) {return}
        for (const index in equippedItemsCopy) {
            const item = { ...equippedItemsCopy[index] };
            console.log(item);
            item.characterId = selectedCharacterId;
            item.itemId = item.item.id;
            item.slotId = item.item.slotId;
    
            const response = await fetch(`http://localhost:8088/character_items?id=${item.id}`)
            const data = await response.json()
    
            if (data.length > 0) {
                delete item.item;
                await fetch(`http://localhost:8088/character_items/${item.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(item),
                })
            } else {
                console.log('POST POST POST POST');
                const newItemResponse = await fetch(`http://localhost:8088/character_items/`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(item),
                })
                const newItemData = await newItemResponse.json()
                updatedItems[index] = { ...equippedItemsCopy[index], id: newItemData.id }
            }
        }
        await fetch(`http://localhost:8088/characters/${selectedCharacterId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(characterCopy)
        })
        await setEquippedItemsCopy(updatedItems);
    };
    
    const getImage = (index) => {
        let item = equippedItemsCopy[index]
        getSingleItem(item.id).then(newItem => {
            console.log(newItem, ' NEW ITEM')   
            let imageUrl = newItem[0].image.imageURL
            console.log(imageUrl, ' IMAGE URL')
            return imageUrl
        })
    }
    

    return (
        <div className='character-builder'>
            {selectedCharacterId === 0 ? 
            <div className='select-character-warning'>Select a character from the Profile page</div> : 
            <>
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
                        <li className='attribute-container d-flex'>
                            <span className='attribute-string'>STR:</span>
                            <button className='decrement-button' onClick={(e) => {handleDecrement(e, 'str')}}>-</button>
                            <span className='attribute-number'>{totalStats.str ? totalStats.str : 0}</span>
                            <button className='increment-button' onClick={() => {handleIncrement('str')}}>+</button>
                        </li>
                        <li className='attribute-container d-flex'>
                            <span className='attribute-string'>DEX:</span>
                            <button className='decrement-button' onClick={(e) => {handleDecrement(e, 'dex')}}>-</button>
                            <span className='attribute-number'>{totalStats.dex ? totalStats.dex : 0}</span>
                            <button className='increment-button' onClick={() => {handleIncrement('dex')}}>+</button>
                        </li>
                        <li className='attribute-container d-flex'>
                            <span className='attribute-string'>AGI:</span>
                            <button className='decrement-button' onClick={(e) => {handleDecrement(e, 'agi')}}>-</button>
                            <span className='attribute-number'>{totalStats.agi ? totalStats.agi : 0}</span>
                            <button className='increment-button' onClick={() => {handleIncrement('agi')}}>+</button>
                        </li>
                    </ul>
                    <p className=''>Attackpower: {calculateDamageObject().attackPower}</p>
                    <p className=''>Swing speed: {calculateDamageObject().speed}</p>
                </div>
                <div className='right-builder col-6'>
                    <h4>Weapon Skills</h4>
                    <div className='weapon-skills'>
                        <div className='weapon-skill-row'>
                            <p className={characterCopy.weaponTypeEquipped === 'onehanded' ? 'selected-weapon-skill' : ''}>Onehanded</p>
                            <button className='decrement-button' onClick={(e) => {handleDecrement(e, 'oneHanded')}}>-</button>
                            <p>{characterCopy.oneHanded}</p>
                            <button className='increment-button' onClick={() => {handleIncrement('oneHanded')}}>+</button>
                        </div>
                        <div className='weapon-skill-row'>
                            <p className={characterCopy.weaponTypeEquipped === 'twohanded' ? 'selected-weapon-skill' : ''}>Twohanded</p>
                            <button className='decrement-button' onClick={(e) => {handleDecrement(e, 'twoHanded')}}>-</button>
                            <p>{characterCopy.twoHanded}</p>
                            <button className='increment-button' onClick={() => {handleIncrement('twoHanded')}}>+</button>
                        </div>


                    </div>
                </div>
            </div>
            <div>
            <h4>Equipment</h4>
            <div className='item-container'>
            {console.log(equippedItemsCopy)}
                {equippedItemsCopy[0]?.item ?
                <div className='equipped-item col-3'>
                    {console.log(equippedItemsCopy)}
                    <h6 style={{color: equippedItemsCopy[0].item.color}}>{equippedItemsCopy[0].item.name}</h6>
                    {console.log(equippedItemsCopy)}
                    <img src={equippedItemsCopy[0]?.item?.image?.imageURL} />
                    <p>Damage: {equippedItemsCopy[0].item.botDamage + ' - ' + equippedItemsCopy[0].item.topDamage}</p>
                    <div className='equipped-item-attributes'>
                        <p>{equippedItemsCopy[0].item.str ? 'STR: ' +  equippedItemsCopy[0].item.str : '' }</p>
                        <p>{equippedItemsCopy[0].item.dex ? 'DEX: ' +  equippedItemsCopy[0].item.dex : '' }</p>
                        <p>{equippedItemsCopy[0].item.agi ? 'AGI: ' +  equippedItemsCopy[0].item.agi : '' }</p>
                    </div>
                 </div> : <div className='equipped-item col-3'>Weapon slot 1</div>
                 }
                {equippedItemsCopy[1]?.item ?
                <div className='equipped-item col-3'>
                    <h6 style={{color: equippedItemsCopy[1].item.color}}>{equippedItemsCopy[1].item.name}</h6>
                    <img src={equippedItemsCopy[1]?.item?.image?.imageURL} />
                    <p>Damage: {equippedItemsCopy[1].item.botDamage + ' - ' + equippedItemsCopy[1].item.topDamage}</p>
                    <div className='equipped-item-attributes'>
                        <p>{equippedItemsCopy[1].item.str ? 'STR: ' +  equippedItemsCopy[1].item.str : '' }</p>
                        <p>{equippedItemsCopy[1].item.dex ? 'DEX: ' +  equippedItemsCopy[1].item.dex : '' }</p>
                        <p>{equippedItemsCopy[1].item.agi ? 'AGI: ' +  equippedItemsCopy[1].item.agi : '' }</p>
                    </div>
                 </div> : <div className='equipped-item col-3'>Weapon slot 2</div>
                 }
            </div>

            </div>
                {totalDamages()}
            <div className='save-character-button'>
                <button onClick={handleSaveCharacter}>Save Character</button>
            </div>
            </>
            }
        </div>
        
    )
}