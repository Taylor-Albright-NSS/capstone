export const getAllItems = () => {
    return fetch(`http://localhost:8088/items`).then(res => res.json())
}

export const getAllItemsWithImages = () => {
    return fetch(`http://localhost:8088/items?imageId_ne=null&_expand=image`).then(res => res.json())
}

export const getAllEquippedItems = (characterId) => {
    return fetch(`http://localhost:8088/character_items?characterId=${characterId}&_expand=item`).then(res => res.json())
}

export const getSingleItem = (itemId) => {
    return fetch(`http://localhost:8088/items?id=${itemId}&_expand=image`).then(res => res.json())
}