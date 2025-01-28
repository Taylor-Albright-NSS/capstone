
const calculcateStatsFromEquipment = (equippedItemsCopy) => {
    let weapons = equippedItemsCopy && equippedItemsCopy.filter(item => item.item.slotId === 'weapon')
    let statsObject = {
        str: 0,
        dex: 0,
        agi: 0
    }
    weapons.forEach(item => {
        if (item.item.str != null) {statsObject.str += item.item.str}
        if (item.item.dex != null) {statsObject.dex += item.item.dex}
        if (item.item.agi != null) {statsObject.agi += item.item.agi}
    })
    return statsObject
}

const calculateIncrementedStats = (characterCopy) => {
    const incrementStatsObject = {
        str: characterCopy?.str,
        dex: characterCopy?.dex,
        agi: characterCopy?.agi
    }
    return incrementStatsObject
}
const calculateTotalStats = () => {
    let equipmentStats = calculcateStatsFromEquipment()
    let cStats = classStatsCopy
    let rStats = raceStatsCopy
    let incrementedStats = calculateIncrementedStats()
    let totalStatsObject = {}
    let stats = ['str', 'dex', 'agi']
    stats.forEach(stat => {
        totalStatsObject[stat] = equipmentStats[stat] + cStats[stat] + rStats[stat] + incrementedStats[stat]
    })
    return totalStatsObject
}