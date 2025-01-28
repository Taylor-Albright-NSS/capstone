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
    //This is for copying the object as a string to fit the code structure of Galvadia
    function copyToClipboard() {
        const characterInfo = `function ${item.name}() {
        let ${item.name} = {
                id:0,
                roomId: currentArea.id,
                name: '${item.name}',
                ${item.type != 'twohanded' ? `picture: {
                    right: ${item.type == 'onehanded' ? `images/weapons/one handed ${item.type}s/${item.name}/${item.name} right.png` : 
                             item.type == 'daggers' ?  `images/weapons/daggers/${item.name}/${item.name} right.png}` : undefined}

                    left: ${item.type == 'onehanded' ? `images/weapons/one handed ${item.type}s/${item.name}/${item.name} right.png` : 
                             item.type == 'daggers' ?  `images/weapons/${item.type}/${item.name}/${item.name} right.png}` : undefined}` :
                             `picture: images/weapons/two handed swords/${item.name}/${item.name}.png`
                },
                color: 'green',
                keywords:
                botDamage: randomNumberRange(${item.botDamage}, ${item.botDamage}),
                topDamage: randomNumberRange(${item.topDamage}, ${item.topDamage}),
                mods: {
                    ${item.slashing && 'slashingPen: 0'}
                    ${item.piercing && 'piercingPen: 0'}
                    ${item.blunt && 'bluntPen: 0'}
                },
                type: {
                    skillUsed: '${item.type}'
                    weapon: true,
                },
                enchantment: [],
                skillUsed: '${item.type}',
                price: 0,
                sellValue: 0,
                description: '${item.description}',
                desc: function() {
                    itemDescription(this)
                },
                swing: (enemy, weapon) => ${item.type == 'onehanded' ? 'oneHandedSwing1(enemy, weapon)' : 
                                            item.type == 'daggers' ? 'daggerSwing1(enemy, weapon)' :
                                            item.type == 'twohanded' ? 'twoHandedSwing1(enemy, weapon)' : undefined
                },
                miss: (enemy, weapon) => ${item.type == 'onehanded' ? 'oneHandedSwing1(enemy, weapon)' : 
                                            item.type == 'daggers' ? 'daggerSwing1(enemy, weapon)' :
                                            item.type == 'twohanded' ? 'twoHandedSwing1(enemy, weapon)' : undefined
                },
            }
            return ${item.name}
        }`
        
        navigator.clipboard.writeText(characterInfo)
            .then(() => {
            })
            .catch(err => {
                console.error("Failed to copy text: ", err);
            });
    }

    return (
            <div className='item-details-main'>
                <div className='item-details'>
                    <h2>{item?.name}</h2>
                    {console.log(item, " ITEM")}
                    <img src={`/${item?.image?.imageURL}`} />
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
                        <button onClick={() => {copyToClipboard()}}>Copy Character Info</button>
                    </div>
                </div>
            </div>

    )
}