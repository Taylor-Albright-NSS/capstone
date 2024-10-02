export const getCharacterClassAndRaceStats = (characterId) => {
    return fetch(`http://localhost:8088/characters?id=${characterId}&_expand=classStats&_expand=raceStats`).then(res => res.json())
}