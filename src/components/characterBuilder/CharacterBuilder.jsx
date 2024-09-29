import { useState, useEffect } from "react"
import { getCharacterById } from "../../services/characterServices"
import { getEquippedWeapons } from "../../services/characterServices"
import './CharacterBuilder.css'

export const CharacterBuilder = ({ currentUser, selectedCharacterId, setSelectedCharacterId }) => {
    const [character, setCharacter] = useState({})
    const [equippedWeapons, setEquippedWeapons] = useState([])
    const [characterCopy, setCharacterCopy] = useState({})
    const [showMessage, setShowMessage] = useState(false)

    useEffect(() => {
        getCharacterById(selectedCharacterId).then(character => {
            setCharacter(character[0])
        })
    }, [characterCopy])

    useEffect(() => {
        getCharacterById(selectedCharacterId).then(character => {
            setCharacterCopy({...character[0]})
        })
    }, [])

    useEffect(() => {
        getEquippedWeapons(selectedCharacterId).then(weapons => {
            setEquippedWeapons(weapons)
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
                    </span>
                <h5>DPS</h5>
                <span className='damage dps'>{(Math.ceil(((calculateAttackPower()?.botDamage1 + calculateAttackPower()?.topDamage1) * 0.5)) / calculateAttackPower()?.speed).toFixed(1)}</span>
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
        }, 3000);
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
        console.log(characterCopy)
    }
    const handleIncrement = (stat) => {
        setCharacterCopy({...characterCopy, [stat]: characterCopy[stat] + 1})
        console.log(characterCopy[stat])
    }

    return (
        <div className='character-builder'>
            <h2>{character && character.name}</h2>
            <div className='builders'>
                <div className='left-builder col-6'>
                    <select>
                        <option>Berserker</option>
                        <option>Fighter</option>
                        <option>Assassin</option>
                    </select>
                    <select>
                        <option>Human</option>
                        <option>Elf</option>
                        <option>Half-Elf</option>
                        <option>Half-Minotaur</option>
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
                        <li className='d-flex'>
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
                        </li>
                    </ul>
                    <p className=''>Attackpower: 3</p>
                </div>
                <div className='right-builder col-6'>
                    <h4>Weapon Skills</h4>
                    <div className='weapon-skills'>
                        <p>Onehanded</p>
                        <p>Twohanded</p>
                    </div>
                </div>
            </div>
            <div className='item-container'>
                <h4>Equipment</h4>
                <ul className='item-list'>
                    <li className='item'>weapon</li>
                    <li className='item'>weapon</li>
                    <li className='item'>weapon</li>
                    <li className='item'>weapon</li>
                    <li className='item'>weapon</li>
                    <li className='item'>weapon</li>
                </ul>
            </div>
            <div className='character-builder-damage'>
                {totalDamages()}
            </div>
        </div>
    )
}