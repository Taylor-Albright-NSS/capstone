import { useState, useEffect } from "react"
import { getAllItemsWithImages } from "../../services/itemServices"
import './ItemSelector.css'

export const ItemSelector = ({
    character, characterCopy, setCharacter, setCharacterCopy,equippedItems, 
    setEquippedItems, equippedItemsCopy, setEquippedItemsCopy, classStats,
    setClassStats, raceStats, setRaceStats, classStatsCopy, setClassStatsCopy,
    raceStatsCopy, setRaceStatsCopy
    }) => {
    const [allItems, setAllItems] = useState([])

    useEffect(() => {
        getAllItemsWithImages().then(allItemsArray => {
            const itemsWithoutHands = allItemsArray.filter(item => {
                return item.id != 1 && item.id !=2
            })
            setAllItems(allItemsArray)
            console.log(allItemsArray)
        })
    }, [])


    const handleEquipItemLeft = (item) => {
        console.log(item, ' ITEM')
        setEquippedItemsCopy({
            ...equippedItemsCopy, 
            0: {...equippedItemsCopy[0], item: item}
        })
        setCharacterCopy({...characterCopy, weaponTypeEquipped: "onehanded"})
    }
    const handleEquipItemRight = (item) => {
        console.log(equippedItemsCopy)
        if (equippedItemsCopy[0]?.item?.type === 'twohanded') {
            setEquippedItemsCopy({
                ...equippedItemsCopy, 
                0: {...equippedItemsCopy[0], item: allItems[0]},
                1: {...equippedItemsCopy[1], item: item}, 
            })
        } else {
            setEquippedItemsCopy({...equippedItemsCopy, 1: {...equippedItemsCopy[1], item: item}})
        }
        setCharacterCopy({...characterCopy, weaponTypeEquipped: "onehanded"})
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
            <h4>Weapons And Armor</h4>
            <div className="scroll-window">
                {allItems && allItems.map(item => {
                    if (item.id != 1 && item.id != 2) {
                        return (
                            <div className='equipment col-3' key={item.id}>
                                <div className='equipment-properties'>
                                    <h6 style={{color: item.color}}>{item.name}</h6>
                                    <img src={item.image.imageURL} />
                                    <p>Damage: {item.botDamage + ' - ' + item.topDamage}</p>
                                    <p>Str: {item.str ? item.str : ''}</p>
                                    <p>Dex: {item.dex ? item.dex : ''}</p>
                                    <p>Agi: {item.agi ? item.agi : ''}</p>
                                </div>
                                { item.type === "onehanded" &&
                                    <div className='equip-buttons-container'>
                                        <div className='equip-and-remove-left'>
                                            <button onClick={(e) => {handleEquipItemLeft(item)}}>Equip Left</button>
                                            <button onClick={(e) => {handleRemoveItem(item, 0)}}>Remove Left</button>
                                        </div>
                                        <div className='equip-and-remove-right'>
                                            <button onClick={(e) => {handleEquipItemRight(item)}}>Equip Right</button>
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