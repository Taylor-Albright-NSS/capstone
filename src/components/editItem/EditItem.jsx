import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useLocation, useNavigate } from "react-router-dom"
import { getSingleItem } from "../../services/itemServices"
import { ImageSelector } from "../common/ImageSelector"
import './EditItem.css'


export const EditItem = () => {
    const [itemData, setItemData] = useState({color: 'lightGreen'})
    const {itemId} = useParams()
    const [showImageSelector, setShowImageSelector] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const toggleModal = () => setIsModalOpen(!isModalOpen)

    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        getSingleItem(itemId).then(singleItem => {
            setItemData(singleItem[0])
        })
    }, [])

    useEffect(() => {
    }, [itemData])

    const handleSubmit = (event) => {
        event.preventDefault()
        delete itemData.image
        fetch(`http://localhost:8088/items/${itemId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(itemData),
        }).then(res => res.json())
        if (location.state?.returnTo) {
            navigate(location.state.returnTo)
            location.state.returnTo = null
        } else {
            navigate('/allitems', { state: { fromEdit: true } });
        }
    }
    const handleChange = (event, propToChange) => {
        let copy = {...itemData}
        let newValue = event.target.value
        if (event.target.type === 'checkbox') {
            copy[propToChange] = !copy[propToChange]
        } else if (!isNaN(copy[propToChange])) {
            if (event.target.value < 0) {
                return
            } else if (propToChange === 'botDamage' && parseInt(newValue) > copy.topDamage ||
                       propToChange === 'topDamage' && parseInt(newValue) < copy.botDamage) {
                return
            }
            copy[propToChange] = parseInt(event.target.value)
        } else {
            copy[propToChange] = parseInt(0)
        }
        setItemData(copy)
    }
    const handleTextChange = (event, propToChange) => {
        let copy = {...itemData}
        copy[propToChange] = event.target.value
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
            <h2>Edit Item</h2>
            <div className='first-container'>
                    <div className='select-image-container'>
                        {<img src={`${itemData?.image?.imageURL}`} onClick={toggleModal} />}
                    </div>
                    <label>Item Name</label>
                    <div>
                        <input
                            type="text"
                            name="name"
                            value={itemData.name || ''}
                            onChange={(event) => {handleTextChange(event, 'name')}}
                            required
                        />
                    </div>
                </div>
                <div className='top-options'>
                    <div className='dropdowns'>
                        <div>
                            <label>Category:</label>
                            <select
                                name="category"
                                value={itemData.category || ''}
                                onChange={(event) => {handleDropdownChange(event, 'category')}}
                            >
                                <option value="">Category</option>
                                <option value="weapon">Weapon</option>
                                <option value="armor">Armor</option>
                            </select>
                        </div>

                        <div>
                            <label>Type:</label>
                            <select
                                name="type"
                                value={itemData.type || ''}
                                onChange={(event) => {handleDropdownChange(event, 'type')}}
                            >
                                <option value="">Type</option>
                                <option value="onehanded">Onehanded</option>
                                <option value="twohanded">Twohanded</option>
                                <option value="daggers">Daggers</option>
                            </select>
                        </div>

                        <div>
                            <label>Subtype:</label>
                            <select
                                name="subType"
                                value={itemData.subType || ''}
                                onChange={(event) => {handleDropdownChange(event, 'subType')}}
                            >
                                <option value="">Subtype</option>
                                <option value="sword">Sword</option>
                                <option value="mace">Mace</option>
                                <option value="axe">Axe</option>
                                <option value="dagger">Dagger</option>
                            </select>
                        </div>
                        </div>

                        <div className='checkboxes-and-text'>
                            <div>
                                <label>Slashing:</label>
                                <input
                                    type="checkbox"
                                    name="slashing"
                                    checked={itemData.slashing || false}
                                    onChange={(event) => {handleChange(event, 'slashing')}}
                                />
                            </div>

                            <div>
                                <label>Piercing:</label>
                                <input
                                    type="checkbox"
                                    name="piercing"
                                    checked={itemData.piercing || false}
                                    onChange={(event) => {handleChange(event, 'piercing')}}
                                />
                            </div>

                            <div>
                                <label>Blunt:</label>
                                <input
                                    type="checkbox"
                                    name="blunt"
                                    checked={itemData.blunt || false}
                                    onChange={(event) => {handleChange(event, 'blunt')}}
                                    />
                            </div>
                            <div>
                                <label>Top Damage:</label>
                                <input
                                    type="number"
                                    name="topDamage"
                                    value={itemData.topDamage || 0}
                                    onChange={(event) => {handleChange(event, 'topDamage')}}
                                    required
                                />
                            </div>
                            <div>
                                <label>Bottom Damage:</label>
                                <input
                                    type="number"
                                    name="botDamage"
                                    value={itemData.botDamage || 0}
                                    onChange={(event) => {handleChange(event, 'botDamage')}}
                                    required
                                    />
                            </div>
                        </div>
                </div>
                <div className='mods-container'>
                    <label>Mods</label>
                    <div className='mods'>
                        <div className="stats-col-1">
                            <div>
                                <label>Str:</label>
                                <input
                                    type="number"
                                    name="mod-str"
                                    value={itemData.str || 0}
                                    onChange={(event) => {handleChange(event, 'str')}}
                                    />
                            </div>
                            <div>
                                <label>Dex:</label>
                                <input
                                    type="number"
                                    name="mod-dex"
                                    value={itemData.dex || 0}
                                    onChange={(event) => {handleChange(event, 'dex')}}
                                    />
                            </div>
                            <div>
                                <label>Agi:</label>
                                <input
                                    type="number"
                                    name="mod-agi"
                                    value={itemData.agi || 0}
                                    onChange={(event) => {handleChange(event, 'agi')}}
                                    />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='description-container'>
                    <label>Description</label>
                    <textarea
                        name="description"
                        value={itemData.description || ''}
                        onChange={(event) => {handleTextChange(event, 'description')}}
                    ></textarea>
                </div>
                <div className='edit-item-buttons'>
                <button onClick={() => {
                        if (location.state.returnTo) {
                            navigate(location.state.returnTo)
                            location.state.returnTo = null
                        } else {
                            navigate(`/allitems`)
                        }
                    }}>Go Back</button>
                    <button type="submit">Save Edits</button>
                </div>
                {isModalOpen && <div className='edit-item-image-selector'><ImageSelector onClose={toggleModal} itemData={itemData} setItemData={setItemData}/></div>} 

            </form>
        </div>
    );
}