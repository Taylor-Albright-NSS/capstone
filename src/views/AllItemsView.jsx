import './AllItemsView.css'
import { useState, useEffect } from 'react'
import { getAllItemsWithImages } from '../services/itemServices'
import { getAllItems } from '../services/itemServices'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom'


export const AllItemsView = () => {
    const [allItems, setAllItems] = useState([])
    const navigate = useNavigate()
    useEffect(() => {
        getAllItemsWithImages().then(itemsArray => {
            setAllItems(itemsArray)
        })
    }, [])
    return (
        <div className='all-items-container'>
            <div className='sort-container'>
                <div className='weapon-sort'>
                <h2>Weapons</h2>
                    <ul>
                        <li>Onehanded</li>
                        <li>Twohanded</li>
                    </ul>
                </div>
                <div className='armor-sort'>
                <h2>Armor</h2>
                    <ul>
                        <li>Plate</li>
                        <li>Leather</li>
                        <li>Cloth</li>
                    </ul>
                </div>
            </div>
            <div className='item-list col-9'>
                {allItems && allItems.map(item => {
                    console.log(item)
                    return (
                        <div className='item col-3'>
                        <button onClick={() => {navigate(`/allitems/itemdetails/${item.id}`)}}><h6>{item.name}</h6></button>
                        <p>Damage: {item.botDamage + ' - ' + item.topDamage}</p>
                        <img src={item?.image?.imageURL} />
                        {console.log(item?.image?.imageURL)}
                        <p>Str: {item.str}</p>
                        <p>Dex: {item.dex}</p>
                        <p>Agi: {item.agi}</p>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}