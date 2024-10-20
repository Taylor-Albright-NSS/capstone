import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { getSingleItem } from "../../services/itemServices"
import { ImageSelector } from "../common/ImageSelector"
// import { ImageSelectModal } from '../common/ImageSelectModal'
import './CreateItem.css'

export const CreateItem = () => {
    const [itemData, setItemData] = useState(
        {color: "rgb(0, 255, 0)", name:'', str: 0, dex: 0, agi: 0, int: 0, wis: 0, mys: 0, con: 0,
            topDamage: 0, botDamage: 0, slotId: 'weapon', imageId: 0, image: {
                id: 0,
                imageURL: "/assets/no image/no image.png",
             }
        }
    )
    const {itemId} = useParams()
    const [showImageSelector, setShowImageSelector] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const openModal = () => setIsModalOpen(!isModalOpen)
    const closeModal = () => setIsModalOpen(false)

    const navigate = useNavigate()

    const handleSubmit = (event) => {
        event.preventDefault()
        delete itemData.image
        fetch(`http://localhost:8088/items/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(itemData),
        }).then(res => res.json())
        navigate('/allitems', { state: { fromEdit: true } });
    }

    const handleTextChange = (event, propToChange) => {
        let copy = {...itemData}
        copy[propToChange] = event.target.value
        setItemData(copy)
    }

    const handleChange = (event, propToChange) => {
        console.log(event.target.value)
        let copy = {...itemData}
        let newValue = event.target.value
        if (event.target.type === 'checkbox') {
            copy[propToChange] = !copy[propToChange]
        } else if (!isNaN(copy[propToChange])) {
            if (event.target.value < 0) {
                return
            } 
            else if (propToChange === 'botDamage' && parseInt(newValue) > copy.topDamage ||
                    propToChange === 'topDamage' && parseInt(newValue) < copy.botDamage) {
                        return
                    }
            copy[propToChange] = parseInt(event.target.value)
        } else {
            copy[propToChange] = parseInt(0)
        }
        setItemData(copy)
    }

    const handleDropdownChange = (event, propToChange) => {
        let copy = {...itemData}
        copy[propToChange] = event.target.value
        setItemData(copy)
    }

    const handleSelectIconToggle = () => {
        setShowImageSelector(!showImageSelector)
    }


    return (
        <div className='edit-item-main'>
            <form className='edit-item-form' onSubmit={handleSubmit}>
                <div className='first-container'>
                        <div className='select-image-container'>
                            {<img src={itemData?.image?.imageURL} onClick={openModal} />}
                            {isModalOpen ? <div className='create-item-image-selector'><ImageSelector itemData={itemData} setItemData={setItemData} /></div> : ''}
                            </div>

                        <label>Item Name</label>

                        <div>
                            <input
                                type="text"
                                name="name"
                                value={itemData.name}
                                onChange={(event) => {handleTextChange(event, 'name')}}
                                required
                            />
                        </div>
                    </div>
                    <div className='second-container'>
                        <div className='top-options'>
                            <div className='dropdowns'>
                                <div>
                                    <label>Category:</label>
                                    <select
                                        name="category"
                                        value={itemData.category}
                                        onChange={(event) => {handleDropdownChange(event, 'category')}}
                                        required
                                    >
                                        <option value="">Category</option>
                                        <option value="weapon">Weapon</option>
                                        {/* <option value="armor">Armor</option> */}
                                        {/* Add more categories if needed */}
                                    </select>
                                </div>

                                <div>
                                    <label>Type:</label>
                                    <select
                                        name="type"
                                        value={itemData.type}
                                        onChange={(event) => {handleDropdownChange(event, 'type')}}
                                        required
                                    >
                                        <option value="">Type</option>
                                        <option value="onehanded">One-Handed</option>
                                        <option value="twohanded">Two-Handed</option>
                                        {/* <option value="daggers">Daggers</option>
                                        <option value="bows">Bows</option>
                                        <option value="unarmed">Unarmed</option> */}
                                    </select>
                                </div>

                                <div>
                                    <label>Subtype:</label>
                                    <select
                                        name="subType"
                                        value={itemData.subType}
                                        onChange={(event) => {handleDropdownChange(event, 'subType')}}
                                        required
                                    >
                                        <option value="">Subtype</option>
                                        <option value="sword">Sword</option>
                                        <option value="mace">Mace</option>
                                        <option value="axe">Axe</option>
                                        {/* <option value="dagger">Dagger</option>
                                        <option value="bow">Bow</option>
                                        <option value="fist">Fist</option> */}
                                    </select>
                                </div>
                                </div>

                                <div className='checkboxes-and-text'>

                                    <div>
                                        <label>Slashing:</label>
                                        <input
                                            type="checkbox"
                                            name="slashing"
                                            checked={itemData.slashing}
                                            onChange={(event) => {handleChange(event, 'slashing')}}
                                        />
                                    </div>

                                    <div>
                                        <label>Piercing:</label>
                                        <input
                                            type="checkbox"
                                            name="piercing"
                                            checked={itemData.piercing}
                                            onChange={(event) => {handleChange(event, 'piercing')}}
                                        />
                                    </div>

                                    <div>
                                        <label>Blunt:</label>
                                        <input
                                            type="checkbox"
                                            name="blunt"
                                            checked={itemData.blunt}
                                            onChange={(event) => {handleChange(event, 'blunt')}}
                                            />
                                    </div>

                                    <div>
                                        <label>Top Damage:</label>
                                        <input
                                            type="number"
                                            name="topDamage"
                                            value={itemData.topDamage}
                                            onChange={(event) => {handleChange(event, 'topDamage')}}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label>Bottom Damage:</label>
                                        <input
                                            type="number"
                                            name="botDamage"
                                            value={itemData.botDamage}
                                            onChange={(event) => {handleChange(event, 'botDamage')}}
                                            required
                                            />
                                    </div>
                                </div>
                    </div>
                </div>
                <div className='third-container'>
                    <div className='mods-container'>
                        <label>Mods</label>
                        <div className='mods'>
                            <div className="stats-col-1">
                                <div>
                                    <label>Str:</label>
                                    <input
                                        type="number"
                                        name="mod-str"
                                        value={itemData.str}
                                        onChange={(event) => {handleChange(event, 'str')}}
                                        />
                                </div>
                                <div>
                                    <label>Dex:</label>
                                    <input
                                        type="number"
                                        name="mod-dex"
                                        value={itemData.dex}
                                        onChange={(event) => {handleChange(event, 'dex')}}
                                        />
                                </div>
                                <div>
                                    <label>Agi:</label>
                                    <input
                                        type="number"
                                        name="mod-agi"
                                        value={itemData.agi}
                                        onChange={(event) => {handleChange(event, 'agi')}}
                                        />
                                </div>
                            </div>
                            <div className='stats-col-2'>
                                <div>
                                    <label>Int:</label>
                                    <input
                                        type="number"
                                        name="mod-int"
                                        value={itemData.int}
                                        onChange={(event) => {handleChange(event, 'int')}}
                                        />
                                </div>
                                <div>
                                    <label>Wis:</label>
                                    <input
                                        type="number"
                                        name="mod-wis"
                                        value={itemData.wis}
                                        onChange={(event) => {handleChange(event, 'wis')}}
                                        />
                                </div>
                                <div>
                                    <label>Mys:</label>
                                    <input
                                        type="number"
                                        name="mod-mys"
                                        value={itemData.mys}
                                        onChange={(event) => {handleChange(event, 'mys')}}
                                        />
                                </div>
                                <div>
                                    <label>Con:</label>
                                    <input
                                        type="number"
                                        name="mod-con"
                                        value={itemData.con}
                                        onChange={(event) => {handleChange(event, 'con')}}
                                        />
                                </div>
                            </div>
                        </div>
                        
                    </div>
                    <div className='description-container'>
                        <label>Description</label>
                        <textarea
                            name="description"
                            value={itemData.description}
                            onChange={(event) => {handleChange(event, 'description')}}
                        ></textarea>
                    </div>
                </div>
                <button type="submit">Create Item</button>
                <button onClick={() => {
                    navigate(`/allitems/itemdetails/${itemId}`)
                }}>Go Back</button>
            </form>
{/* 
            <div className='image-select-window'>
            </div> */}
        </div>
    );
}