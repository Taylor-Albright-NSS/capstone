import { useState, useEffect } from "react"
import { getAllItemsWithImages } from "../../services/itemServices"
import './ItemSelector.css'
import { useNavigate } from "react-router-dom"

export const ItemSelector = ({
        characterCopy, setCharacterCopy, equippedItemsCopy, setEquippedItemsCopy
    }) => {
    const [allItems, setAllItems] = useState([])
    const navigate =  useNavigate()
    useEffect(() => {
        getAllItemsWithImages().then(allItemsArray => {
            const itemsWithoutHands = allItemsArray.filter(item => {
                return item.id != 1 && item.id !=2
            })
            itemsWithoutHands.sort((a, b) => a.type.localeCompare(b.type));
            itemsWithoutHands.unshift(allItemsArray[0])
            itemsWithoutHands.unshift(allItemsArray[1])
            setAllItems(itemsWithoutHands)
        })
    }, [])


    const handleEquipItemLeft = (item, weaponSkill) => {
        setEquippedItemsCopy({
            ...equippedItemsCopy, 
            0: {...equippedItemsCopy[0], item: item}
        })
        setCharacterCopy({...characterCopy, weaponTypeEquipped: weaponSkill})
    }
    const handleEquipItemRight = (item, weaponSkill) => {
        if (equippedItemsCopy[0]?.item?.type === 'twohanded') {
            setEquippedItemsCopy({
                ...equippedItemsCopy, 
                0: {...equippedItemsCopy[0], item: allItems[0]},
                1: {...equippedItemsCopy[1], item: item}, 
            })
        } else {
            setEquippedItemsCopy({...equippedItemsCopy, 1: {...equippedItemsCopy[1], item: item}})
        }
        setCharacterCopy({...characterCopy, weaponTypeEquipped: weaponSkill})
    }

    const handleEquipTwohanded = (item) => {
        setEquippedItemsCopy({
            ...equippedItemsCopy,
            0: {...equippedItemsCopy[0], item: item},
            1: {...equippedItemsCopy[1], item: allItems[1]}
        })
        setCharacterCopy({...characterCopy, weaponTypeEquipped: "twohanded"})
    }

    const handleRemoveItem = (item, weaponSlot) => {
        let fist
        if (weaponSlot === 0) {
            fist = allItems[0]
        } else {
            fist = allItems[1]
        }
        setEquippedItemsCopy({
            ...equippedItemsCopy,
            [weaponSlot]: {...equippedItemsCopy[weaponSlot], item: fist}
        })
    }

    return (
        <div className='item-selector'>
            <div className="scroll-window">
                {allItems && allItems.map(item => {
                    if (item.id != 1 && item.id != 2) {
                        return (
                            <div className={`item-selector-equipment item-selector-${item.type}`} key={item.id}>
                                <div className='equipment-properties'>
                                    <h6>{item.name}</h6>
                                    <img src={item.image.imageURL} onClick={() => {navigate(`/allitems/edititem/${item.id}`, { state: { returnTo: '/characterbuilder' } })}} />
                                    <p>Damage: {item.botDamage + ' - ' + item.topDamage}</p>
                                    <div className='item-selector-item-attributes'>
                                        <p>{item.str ? 'Str: ' + item.str : ''}</p>
                                        <p>{item.dex ? 'Dex: ' + item.dex : ''}</p>
                                        <p>{item.agi ? 'Agi: ' + item.agi : ''}</p>
                                    </div>
                                </div>
                                { item.type === "onehanded" &&
                                    <div className='equip-buttons-container'>
                                        <div className='equip-and-remove-left'>
                                            <button onClick={(e) => {handleEquipItemLeft(item, 'onehanded')}}>Equip Left</button>
                                            <button onClick={(e) => {handleRemoveItem(item, 0)}}>Remove Left</button>
                                        </div>
                                        <div className='equip-and-remove-right'>
                                            <button onClick={(e) => {handleEquipItemRight(item, 'onehanded')}}>Equip Right</button>
                                            <button onClick={(e) => {handleRemoveItem(item, 1)}}>Remove Right</button>
                                        </div>
                                    </div>
                                }
                                { item.type === "daggers" &&
                                    <div className='equip-buttons-container'>
                                        <div className='equip-and-remove-left'>
                                            <button onClick={(e) => {handleEquipItemLeft(item, 'daggers')}}>Equip Left</button>
                                            <button onClick={(e) => {handleRemoveItem(item, 0)}}>Remove Left</button>
                                        </div>
                                        <div className='equip-and-remove-right'>
                                            <button onClick={(e) => {handleEquipItemRight(item, 'daggers')}}>Equip Right</button>
                                            <button onClick={(e) => {handleRemoveItem(item, 1)}}>Remove Right</button>
                                        </div>
                                    </div>
                                }
                                { item.type === "twohanded" &&
                                        <div className='equip-twohanded-buttons'>
                                            <button onClick={(e) => {handleEquipTwohanded(item)}}>Equip</button>
                                            <button onClick={(e) => {handleRemoveItem(item, 0)}}>Remove</button>
                                        </div>
                                }
                            </div>
                        )
                    }
                })}
            </div>
        </div>
    )
}