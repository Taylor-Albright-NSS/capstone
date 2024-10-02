export const getAllItems = () => {
    return fetch(`http://localhost:8088/items`).then(res => res.json())
}

export const getSelectedWeapons = (weaponId) => {
    return fetch(`http://localhost:8088/items?id=${weaponId}`).then(res => res.json())
}

export const getAllEquippedItems = (characterId) => {
    return fetch(`http://localhost:8088/character_items?characterId=${characterId}&_expand=item`).then(res => res.json())
}