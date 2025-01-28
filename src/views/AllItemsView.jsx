import './AllItemsView.css'
import { useState, useEffect } from 'react'
import { getAllItemsWithImages } from '../services/itemServices'
import { useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom'


export const AllItemsView = ({ equippedItemsCopy, setEquippedItemsCopy }) => {
    const [allItems, setAllItems] = useState([])
    const [displayedItems, setDisplayedItems]  = useState([])
    const location = useLocation();
    const navigate = useNavigate()
    useEffect(() => {
        getAllItemsWithImages().then(itemsArray => {
            itemsArray.sort((a, b) => a.type.localeCompare(b.type));

            setAllItems(itemsArray)
            setDisplayedItems(itemsArray)
        })
    }, [])

    useEffect(() => {
        if (location.state?.fromEdit) {
            getAllItemsWithImages().then(itemsArray => {
                setAllItems(itemsArray)
                setDisplayedItems(itemsArray)
            })
        }
    }, [])

    const sortWeapons = (event, weaponType) => {
        const selectedElement = document.querySelectorAll('.sort-on-click')
        selectedElement.forEach(element => {
            element.classList.remove('selected')
        })
        event.target.classList.add('selected')
        if (!weaponType) {
            setDisplayedItems(allItems)
        } else {
            let filteredItems = allItems.filter(item => item.type === weaponType)
            setDisplayedItems(filteredItems)
        }
    }


    const handleDelete = async (itemId) => {
        const confirmDelete = confirm(`Are you sure you want to delete this item?`)
        if (confirmDelete) {
            await fetch(`http://localhost:8088/items/${itemId}`, {
                method: "DELETE"
            })
            await getAllItemsWithImages().then(itemsArray => {
                setAllItems(itemsArray)
                setDisplayedItems(itemsArray)
            })

        }
        for (const item in equippedItemsCopy) {
            if (equippedItemsCopy[item].item.id === itemId) {
                delete equippedItemsCopy[item].item
                setEquippedItemsCopy(
                    {
                        [item]: {...equippedItemsCopy[item]},
                        item: allItems[item]
                    }
                )
            }
        }

    }

    return (
        <div className='all-items-container'>
            <div className='sort-container'>
                <div className='weapon-sort'>
                    <h2>Weapons</h2>
                    <ul>
                    <li className='sort-on-click' onClick={(event) => {sortWeapons(event, )}}>All Weapons</li>
                    <li className='sort-on-click' onClick={(event) => {sortWeapons(event, 'onehanded')}}>Onehanded</li>
                    <li className='sort-on-click' onClick={(event) => {sortWeapons(event, 'twohanded')}}>Twohanded</li>
                    <li className='sort-on-click' onClick={(event) => {sortWeapons(event, 'daggers')}}>Daggers</li>
                    </ul>
                </div>
            </div>
            <div className='item-list-border'>
                <div className='item-list col-11'>
                    {displayedItems && displayedItems.map(item => {
                    if (item.id != 1 && item.id != 2) {
                        return (
                            <div key={item.id} style={{cursor: "pointer"}} className='all-items-item' onClick={() => {navigate(`/allitems/itemdetails/${item.id}`)}}>
                                <div>
                                    <div className='item-top'>
                                        <h6 style={{cursor: "pointer"}}>{item.name}</h6>
                                        <img src={item?.image?.imageURL}/>
                                        <h6 style={{cursor: "pointer"}}>Damage: {item.botDamage + ' - ' + item.topDamage}</h6>
                                    </div>
                                    <div className='item-bot'>
                                        <div className='stats-group-1'>
                                            {item.str > 0 ? <div className='attribute'><span style={{width: '30px'}}>Str:</span><span className='attribute-number'>{item.str}</span></div> : ''}
                                            {item.dex > 0 ? <div className='attribute'><span style={{width: '30px'}}>Dex:</span><span className='attribute-number'>{item.dex}</span></div> : ''}
                                            {item.agi > 0 ? <div className='attribute'><span style={{width: '30px'}}>Agi:</span><span className='attribute-number'>{item.agi}</span></div> : ''}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                    })}
                </div>
            </div>
        </div>
    )
}