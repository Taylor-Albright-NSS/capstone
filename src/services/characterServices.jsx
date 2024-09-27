export const getAllUserCharacters = (currentUserId) => {
    return fetch(`http://localhost:8088/characters?userId=${currentUserId}`).then(res => res.json())
}

export const getCharacterById = (characterId) => {
    return fetch(`http://localhost:8088/characters?id=${characterId}`).then(res => res.json())
}