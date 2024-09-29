import { CharacterBuilder } from "../components/characterBuilder/CharacterBuilder"
import { ItemSelector } from "../components/characterBuilder/ItemSelector"
import { useState, useEffect } from "react"

export const CharacterBuilderView = ({ currentUser, selectedCharacterId, setSelectedCharacterId }) => {

    useEffect(() => {
        console.log(selectedCharacterId)
        console.log(setSelectedCharacterId)
    }, [])

    return (
        <div className='d-flex'>
            <ItemSelector
            currentUser={currentUser} 
            selectedCharacterId={selectedCharacterId} 
            setSelectedCharacterId={setSelectedCharacterId}
             />
            <CharacterBuilder 
            currentUser={currentUser} 
            selectedCharacterId={selectedCharacterId} 
            setSelectedCharacterId={setSelectedCharacterId} 
            />
        </div>
    )
}