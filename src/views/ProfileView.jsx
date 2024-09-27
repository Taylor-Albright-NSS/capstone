import { CharacterList } from "../components/profile/CharacterList"
import { CharacterSheet } from "../components/profile/CharacterSheet"
import { useState } from "react"
import './ProfileView.css'

export const ProfileView = ({ currentUser }) => {
    const [selectedCharacter, setSelectedCharacter] = useState(0)
    console.log(selectedCharacter)
    return (
        <div className='profile-view'>
            <CharacterList currentUser={currentUser} setSelectedCharacter={setSelectedCharacter}/>
            <CharacterSheet currentUser={currentUser} selectedCharacter={selectedCharacter} />
        </div>
    )
}