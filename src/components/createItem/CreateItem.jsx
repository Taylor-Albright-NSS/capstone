import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { getSingleItem } from "../../services/itemServices"

export const CreateItem = () => {
    const [itemData, setItemData] = useState({color: 'lightGreen'})
    const {itemId} = useParams()
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
    }
    const handleChange = (event, propToChange) => {
        let copy = {...itemData}
        if (event.target.type === 'checkbox') {
            copy[propToChange] = !copy[propToChange]
        } else if (!isNaN(copy[propToChange])) {
            copy[propToChange] = parseInt(event.target.value)
        } else {
            copy[propToChange] = event.target.value
        }
        setItemData(copy)
        console.log(copy)  
    }
    return (
        <div className='edit-item-main'>
            <h2>Item Creator</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={itemData.name}
                        onChange={(event) => {handleChange(event, 'name')}}
                        required
                    />
                </div>

                <div>
                    <label>Image:</label>
                    <button type="button" onClick={() => setItemData({ ...itemData, imageId: 1 })}>
                        Select Image
                    </button>
                    {/* Replace with your logic for displaying the selected image */}
                    <p>Selected Image ID: {itemData.imageId}</p>
                </div>

                <div>
                    <label>Category:</label>
                    <select
                        name="category"
                        value={itemData.category}
                        onChange={(event) => {handleChange(event, 'category')}}
                    >
                        <option value="weapon">Weapon</option>
                        <option value="armor">Armor</option>
                        {/* Add more categories if needed */}
                    </select>
                </div>

                <div>
                    <label>Type:</label>
                    <select
                        name="type"
                        value={itemData.type}
                        onChange={(event) => {handleChange(event, 'type')}}
                    >
                        <option value="">Select Type</option>
                        <option value="onehanded">One-Handed</option>
                        <option value="twohanded">Two-Handed</option>
                        <option value="daggers">Daggers</option>
                        <option value="bows">Bows</option>
                        <option value="unarmed">Unarmed</option>
                    </select>
                </div>

                <div>
                    <label>Subtype:</label>
                    <select
                        name="subType"
                        value={itemData.subType}
                        onChange={(event) => {handleChange(event, 'subType')}}
                    >
                        <option value="">Select Subtype</option>
                        <option value="sword">Sword</option>
                        <option value="mace">Mace</option>
                        <option value="axe">Axe</option>
                        <option value="dagger">Dagger</option>
                        <option value="bow">Bow</option>
                        <option value="fist">Fist</option>
                    </select>
                </div>

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


                <div>
                    <label>Mods:</label>
                    <div>
                        <label>Str:</label>
                        <input
                            type="number"
                            name="mod_str"
                            value={itemData.str}
                            onChange={(event) => {handleChange(event, 'str')}}
                            />
                    </div>
                    <div>
                        <label>Dex:</label>
                        <input
                            type="number"
                            name="mod_dex"
                            value={itemData.dex}
                            onChange={(event) => {handleChange(event, 'dex')}}
                            />
                    </div>
                    <div>
                        <label>Agi:</label>
                        <input
                            type="number"
                            name="mod_agi"
                            value={itemData.agi}
                            onChange={(event) => {handleChange(event, 'agi')}}
                            />
                    </div>
                </div>

                <div>
                    <label>Description:</label>
                    <textarea
                        name="description"
                        value={itemData.description}
                        onChange={(event) => {handleChange(event, 'description')}}
                        required
                    ></textarea>
                </div>

                <button type="submit">Submit</button>
                <button onClick={() => {
                    navigate(`/allitems/itemdetails/${itemId}`)
                }}>Go Back</button>
            </form>
        </div>
    );
}