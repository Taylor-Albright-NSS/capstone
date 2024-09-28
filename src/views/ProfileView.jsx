import { CharacterList } from "../components/profile/CharacterList"
import { CharacterSheet } from "../components/profile/CharacterSheet"
import { useEffect, useState } from "react"
import './ProfileView.css'

export const ProfileView = ({ currentUser }) => {
    const [selectedCharacterId, setSelectedCharacterId] = useState(0)

    return (
        <div className='profile-view'>
            <CharacterList currentUser={currentUser} selectedCharacterId={selectedCharacterId} setSelectedCharacterId={setSelectedCharacterId}/>
            <CharacterSheet currentUser={currentUser} selectedCharacterId={selectedCharacterId} setSelectedCharacterId={setSelectedCharacterId} />
        </div>
    )
}