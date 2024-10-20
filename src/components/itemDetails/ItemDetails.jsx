import { useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { getSingleItem } from "../../services/itemServices"
import './ItemDetails.css'

export const ItemDetails = () => {
    const [item, setItem] = useState({})
    const { itemId } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        getSingleItem(itemId).then(singleItem => {
            console.log(singleItem[0])
            setItem(singleItem[0])
        })
    }, [itemId])

    const handleItemDelete = async () => {
        await fetch(`http://localhost:8088/items/${itemId}`, {
            method: "DELETE"
        }).then(() => {
            navigate('/allitems')
        })
    }


    return (
            <div className='item-details-main'>
                <div className='item-details'>
                    <h2>{item?.name}</h2>
                    <img src={item?.image?.imageURL} />
                    <div className='item-details-attributes'>
                        {item?.str > 0 && <p>{'Str: ' + item.str}</p>}
                        {item?.dex > 0 && <p>{'Dex: ' + item.dex}</p>}
                        {item?.agi > 0 && <p>{'Agi: ' + item.agi}</p>}
                    </div>
                    <p className='item-description'>{item?.description}</p>
                    <div>
                        <button onClick={() => {navigate(`/allitems/edititem/${itemId}`)}}>Edit</button>
                        <button onClick={handleItemDelete}>Delete</button>
                        <button onClick={() => {navigate('/allitems')}}>Back</button>
                    </div>
                </div>
            </div>

    )
}