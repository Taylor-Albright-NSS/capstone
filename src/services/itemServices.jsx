export const getAllItems = () => {
    return fetch(`http://localhost:8088/items`).then(res => res.json())
}

export const getAllItemsWithImages = () => {
    return fetch(`http://localhost:8088/items?imageId_ne=null&_expand=image`).then(res => res.json())
}

export const getAllEquippedItems = (characterId) => {
    return fetch(`http://localhost:8088/character_items?characterId=${characterId}&_expand=item`).then(res => res.json())
}
export const getAllEquippedItems2 = async (characterId) => {
    const equipmentArray = await fetch(`http://localhost:8088/character_items?characterId=${characterId}&_expand=item`).then(res => res.json())
    const updatedEquipmentArray = await Promise.all(equipmentArray.map(async (item) => {
        const singleItemArray = await getSingleItem(item.itemId);
        item.item = singleItemArray[0];
        return item
    }))
    return updatedEquipmentArray
}
export const getAllEquippedItems3 = async (characterId) => {
    const equipmentArray = await fetch(`http://localhost:8088/character_items?characterId=${characterId}&_expand=item`).then(res => res.json())
    const updatedEquipmentArray = await Promise.all(equipmentArray.map(async (item) => {
        const singleItemArray = await getSingleItem(item.itemId);
        item.item = singleItemArray[0];
        return item
    }))
    let mappedObject = {}
    updatedEquipmentArray.map((item, index) => {
        mappedObject[index] = item
    })
    return mappedObject
}

export const getSingleItem = (itemId) => {
    return fetch(`http://localhost:8088/items?id=${itemId}&_expand=image`).then(res => res.json())
}

