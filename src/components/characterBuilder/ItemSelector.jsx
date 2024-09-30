import { useState, useEffect } from "react"
import { getAllItems } from "../../services/itemServices"
import './ItemSelector.css'

export const ItemSelector = ({character, characterCopy, setCharacter, setCharacterCopy,
    equippedItems, setEquippedItems, equippedItemsCopy, setEquippedItemsCopy
}) => {
    const [allItems, setAllItems] = useState([])

    useEffect(() => {
        getAllItems().then(allItemsArray => {
            setAllItems(allItemsArray)
            console.log(allItemsArray)
        })
    }, [])

    const handleEquipItem = (e, item, weaponSlot) => {
        setCharacterCopy({
            ...characterCopy, 
            [weaponSlot]: item.id
        })
        setEquippedItemsCopy({
            ...equippedItemsCopy,
            [weaponSlot]: item
        })
        console.log(characterCopy, ' CHARACTER COPY')
        console.log(equippedItemsCopy, ' EQUIPPED ITEMS COPY')
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
                            <div className='equip-buttons-container'>
                            <button onClick={(e) => {handleEquipItem(e, item, 'weaponSlot2')}}>Equip Left</button>
                                <button onClick={(e) => {handleEquipItem(e, item, 'weaponSlot1')}}>Equip Right</button>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}