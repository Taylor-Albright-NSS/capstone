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

    return (
        <div className='item-selector'>
            <h4>Item Selector</h4>
            <div>Item Sorter</div>
        </div>
    )
}