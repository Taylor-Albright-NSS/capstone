import './CharacterSheet.css'
import { Character } from './Character'

export const CharacterSheet = ({ currentUser, selectedCharacter }) => {
    console.log(selectedCharacter)
    return (
        <Character currentUser={currentUser} selectedCharacter={selectedCharacter} />
    )
}