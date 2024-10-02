
export const calculcateStatsFromEquipment = (equippedItemsCopy) => {
    console.log(equippedItemsCopy)
    let weapons = equippedItemsCopy && equippedItemsCopy.filter(item => item.item.slotId === 'weapon')
    let statsObject = {
        str: 0,
        dex: 0,
        agi: 0
    }
    weapons.forEach(item => {
        console.log(item, ' ITEM')
        if (item.item.str != null) {statsObject.str += item.item.str}
        if (item.item.dex != null) {statsObject.dex += item.item.dex}
        if (item.item.agi != null) {statsObject.agi += item.item.agi}
    })
    return statsObject
}

export const calculateIncrementedStats = (characterCopy) => {
    const incrementStatsObject = {
        str: characterCopy?.incrementedStr,
        dex: characterCopy?.incrementedDex,
        agi: characterCopy?.incrementedAgi
    }
    return incrementStatsObject
}
export const calculateTotalStats = () => {
    let equipmentStats = calculcateStatsFromEquipment()
    let cStats = classStatsCopy
    let rStats = raceStatsCopy
    let incrementedStats = calculateIncrementedStats()
    let totalStatsObject = {}
    console.log(equipmentStats)
    console.log(cStats)
    console.log(rStats)
    console.log(incrementedStats)
    console.log(totalStatsObject)
    let stats = ['str', 'dex', 'agi']
    stats.forEach(stat => {
        totalStatsObject[stat] = equipmentStats[stat] + cStats[stat] + rStats[stat] + incrementedStats[stat]
    })
    console.log(totalStatsObject)
    return totalStatsObject
}