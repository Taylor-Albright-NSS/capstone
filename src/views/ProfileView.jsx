import { CharacterList } from "../components/profile/CharacterList"
import { CharacterSheet } from "../components/profile/CharacterSheet"
import { useEffect, useState } from "react"
import './ProfileView.css'

export const ProfileView = ({ currentUser, selectedCharacterId, setSelectedCharacterId, classStats,
    setClassStats, raceStats, setRaceStats, character, setCharacter, characterCopy, setCharacterCopy,
    equippedItems, setEquippedItems, equippedItemsCopy, setEquippedItemsCopy, classStatsCopy,
    setClassStatsCopy, raceStatsCopy, setRaceStatsCopy
 }) => {
    // const [selectedCharacterId, setSelectedCharacterId] = useState(0)


    return (
        <div className='profile-view'>
            <CharacterList currentUser={currentUser}
             selectedCharacterId={selectedCharacterId} 
             setSelectedCharacterId={setSelectedCharacterId}
             classStats={classStats}
             setClassStats={setClassStats}
             raceStats={raceStats}
             setRaceStats={setRaceStats}
             character={character}
             setCharacter={setCharacter}
             characterCopy={characterCopy}
             setCharacterCopy={setCharacterCopy}
             equippedItems={equippedItems}
             setEquippedItems={setEquippedItems}
             equippedItemsCopy={equippedItemsCopy}
             setEquippedItemsCopy={setEquippedItemsCopy}
             classStatsCopy={classStatsCopy}
             setClassStatsCopy={setClassStatsCopy}
             raceStatsCopy={raceStatsCopy}
             setRaceStatsCopy={setRaceStatsCopy}
             />
            <CharacterSheet currentUser={currentUser}
             selectedCharacterId={selectedCharacterId} 
             setSelectedCharacterId={setSelectedCharacterId} 
             classStats={classStats}
             setClassStats={setClassStats}
             raceStats={raceStats}
             setRaceStats={setRaceStats}
             character={character}
             setCharacter={setCharacter}
             characterCopy={characterCopy}
             setCharacterCopy={setCharacterCopy}
             equippedItems={equippedItems}
             setEquippedItems={setEquippedItems}
             equippedItemsCopy={equippedItemsCopy}
             setEquippedItemsCopy={setEquippedItemsCopy}
             classStatsCopy={classStatsCopy}
             setClassStatsCopy={setClassStatsCopy}
             raceStatsCopy={raceStatsCopy}
             setRaceStatsCopy={setRaceStatsCopy}
             />
        </div>
    )
}