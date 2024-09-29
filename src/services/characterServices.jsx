export const getAllUserCharacters = (currentUserId) => {
    return fetch(`http://localhost:8088/characters?userId=${currentUserId}`).then(res => res.json())
}

export const getCharacterById = (characterId) => {
    return fetch(`http://localhost:8088/characters?id=${characterId}`).then(res => res.json())
}

export const getEquippedWeapons = (characterId) => {
    console.log(characterId, ' CHARACTER ID')
    return fetch(`http://localhost:8088/character_items?characterId=${characterId}&_expand=item`).then(res => res.json())

}

