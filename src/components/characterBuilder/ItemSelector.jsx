import { useState, useEffect } from "react"
import { getAllItems } from "../../services/itemServices"
import './ItemSelector.css'

export const ItemSelector = ({
    character, characterCopy, setCharacter, setCharacterCopy,equippedItems, 
    setEquippedItems, equippedItemsCopy, setEquippedItemsCopy, classStats,
    setClassStats, raceStats, setRaceStats
    }) => {
    const [allItems, setAllItems] = useState([])

    useEffect(() => {
        getAllItems().then(allItemsArray => {
            setAllItems(allItemsArray)
            console.log(allItemsArray)
        })
    }, [])

    const handleEquipItemLeft = (item) => {
        setCharacterCopy({
            ...characterCopy, 
            weaponSlot1: item.id,
            weaponSkillUsed: item.type,
            weaponTypeEquipped: item.type
        })
        setEquippedItemsCopy({
            ...equippedItemsCopy,
            weaponSlot1: item
        })
    }
    const handleEquipItemRight = (item) => {
        setCharacterCopy({
            ...characterCopy, 
            weaponSlot2: item.id,
            weaponSkillUsed: item.type,
            weaponTypeEquipped: item.type

        })
        setEquippedItemsCopy({
            ...equippedItemsCopy,
            weaponSlot1: equippedItemsCopy?.weaponSlot1?.type === 'Twohanded' ? null : equippedItemsCopy.weaponSlot1,
            weaponSlot2: item,
        })
    }


    const handleEquipTwohanded = (item) => {
        setCharacterCopy({
            ...characterCopy, 
            weaponSlot1: item.id,
            weaponSlot2: null,
            weaponSkillUsed: item.type
        })
        setEquippedItemsCopy({
            ...equippedItemsCopy,
            weaponSlot1: item,
            weaponSlot2: null
        })
    }

    const handleRemoveItem = (item, weaponSlot) => {
        setCharacterCopy({
            ...characterCopy, 
            [weaponSlot]: null,
            // weaponSkillUsed: !characterCopy.weaponSlot1 && !characterCopy.weaponSlot2 ? null : item.type,
            // weaponTypeEquipped: !characterCopy.weaponSlot1 && !characterCopy.weaponSlot2 ? null : item.type 
        })
        // if (!characterCopy.weaponSlot1 && !characterCopy.weaponSlot2) {
        //     setCharacterCopy({
        //         ...characterCopy, 
        //         weaponSkillUsed: null
        //     })
        // }
        setEquippedItemsCopy({
            ...equippedItemsCopy,
            [weaponSlot]: null
        })
    }

    return (
        <div className='item-selector'>
            <h4>Item Selector</h4>
            <div className="scroll-window">
                {allItems && allItems.map(item => {
                    return (
                        <div className='equipment col-3'>
                            <div className='equipment-properties'>
                                <h6 style={{color: item.color}}>{item.name}</h6>
                                <p>Damage: {item.botDamage + ' - ' + item.topDamage}</p>
                                <p>Str: {item.str ? item.str : ''}</p>
                                <p>Dex: {item.dex ? item.dex : ''}</p>
                                <p>Agi: {item.agi ? item.agi : ''}</p>
                            </div>
                            { item.type === "Onehanded" &&
                                <div className='equip-buttons-container'>
                                <button onClick={(e) => {handleEquipItemLeft(item)}}>Equip Left</button>
                                <button onClick={(e) => {handleEquipItemRight(item)}}>Equip Right</button>
                                <button onClick={(e) => {handleRemoveItem(item, 'weaponSlot1')}}>Remove Left</button>
                                <button onClick={(e) => {handleRemoveItem(item, 'weaponSlot2')}}>Remove Right</button>
                                </div>
                            }
                            { item.type === "Twohanded" &&
                                <div className='equip-buttons-container'>
                                <button onClick={(e) => {handleEquipTwohanded(item)}}>Equip</button>
                                <button onClick={(e) => {handleRemoveItem(item, 'weaponSlot1')}}>Remove</button>
                                </div>
                            }
                        </div>
                    )
                })}
            </div>
        </div>
    )
}