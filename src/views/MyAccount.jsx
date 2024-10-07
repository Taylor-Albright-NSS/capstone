import { useEffect, useState } from "react"
import { getUserById } from "../services/userServices"
import './MyAccount.css'

export const MyAccount = ({ currentUser }) => {
    const [user, setUser] = useState()
    const [userEdit, setUserEdit] = useState()
    const [isAccountBeingEdited, setIsAccountBeingEdited] = useState(false)
    useEffect(() => {
        getUserById(currentUser).then(user => {
            console.log(currentUser)
            console.log(user)
            setUser(user[0])
            setUserEdit(user[0])
        })
    }, [])

    const handleAccountEditToggle = () => {
        setIsAccountBeingEdited(!isAccountBeingEdited)
    }

    const handleSaveEdits = async () => {
        setUser(userEdit)
        setIsAccountBeingEdited(false)
        await fetch(`http://localhost:8088/users/${currentUser}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userEdit),
        }).then(res => res.json())
    }

    const handleChangeEvent = (event, field) => {
        let copy = {...userEdit}
        copy[field] = event.target.value
        setUserEdit(copy)
    }
    return (
        <div className='account-container'>
            <h4>Account Information</h4>
            {!isAccountBeingEdited ? 
            <div className='account-information'>
                <dl>
                    <dt>Name</dt>
                    <dd>{user ? user.name : ''}</dd>
                    <dt>Username</dt>
                    <dd>{user ? user.userName : ''}</dd>
                    <dt>Email</dt>
                    <dd>{user ? user.email : ''}</dd>
                    <dt>Password</dt>
                    <dd>{user ? user.password : ''}</dd>
                </dl>
                <button onClick={handleAccountEditToggle}>Edit Account Information</button>
            </div> 
            : 
            <div className='edit-account-information'>
                <dl>
                    <dt>Name</dt>
                    <dd><input type='text' value={userEdit ? userEdit.name : ''} onChange={(event) => {handleChangeEvent(event, 'name')}}/></dd>
                    <dt>Username</dt>
                    <dd><input type='text' value={userEdit ? userEdit.userName : ''} onChange={(event) => {handleChangeEvent(event, 'userName')}}/></dd>
                    <dt>Email</dt>
                    <dd><input type='text' value={userEdit ? userEdit.email : ''} onChange={(event) => {handleChangeEvent(event, 'email')}}/></dd>
                    <dt>Password</dt>
                    <dd><input type='text' value={userEdit ? userEdit.password : ''} onChange={(event) => {handleChangeEvent(event, 'password')}}/></dd>
                </dl>
                <button onClick={handleAccountEditToggle}>Back</button>
                <button onClick={handleSaveEdits}>Save Edits</button>
            </div> 
            }
        </div>
    )
}