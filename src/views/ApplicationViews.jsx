import { Route, Routes, Outlet } from "react-router-dom"
import { Navbar } from "../components/navbar/Navbar"
import { ProfileView } from "./ProfileView"
import { CharacterBuilder } from "../components/characterBuilder/CharacterBuilder"
import { useState, useEffect } from "react"


export const ApplicationViews = () => {
    const [currentUser, setCurrentUser] = useState({})
    useEffect(() => {
        const currentUserObj = localStorage.getItem('capstone_user')
        const parsedCurrentUser = JSON.parse(currentUserObj)
        const currentUserId = parseInt(parsedCurrentUser.id)
        setCurrentUser(currentUserId)
        }, [])

    return (
        <Routes>
            <Route path="/" element={
                <>
                    <Navbar />
                    <Outlet/>
                </>
                }>
                <Route path='profile' element={<ProfileView currentUser={currentUser} />} />
                <Route path='characterbuilder' element={<CharacterBuilder currentUser={currentUser} />} />
            </Route>
        </Routes>
    )  
}

