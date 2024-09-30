import { useState, useEffect } from "react"
import { getAllItems } from "../../services/itemServices"
import './ItemSelector.css'

export const ItemSelector = () => {
    const [allItems, setAllItems] = useState([])

    useEffect(() => {
        getAllItems().then(allItemsArray => {
            setAllItems(allItemsArray)
            console.log(allItemsArray)
        })
    }, [])

    const handleEquipItem = () => {
        
    }

    return (
        <div className='item-selector'>
            <h4>Item Selector</h4>
            <div className="scroll-window">
                {allItems && allItems.map(item => {
                    return (
                        <div className='equipment col-3' onClick={handleEquipItem}>
                            <h6 style={{color: item.color}}>{item.name}</h6>
                            <p>Damage: {item.botDamage + ' - ' + item.topDamage}</p>
                            <p>Str: {item.str ? item.str : ''}</p>
                            <p>Dex: {item.dex ? item.dex : ''}</p>
                            <p>Agi: {item.agi ? item.agi : ''}</p>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}