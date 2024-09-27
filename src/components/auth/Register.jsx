import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./Login.css"
import { getUserByEmail, createUser } from "../../services/userServices"

export const Register = () => {
  const [user, setUser] = useState({
    name: "",
    userName: "",
    email: "",
    password: ""
  })
  let navigate = useNavigate()

  const registerNewUser = () => {
    createUser(user).then((createdUser) => {
      if (createdUser.hasOwnProperty("id")) {
        localStorage.setItem(
          "capstone_user",
          JSON.stringify({
            id: createdUser.id,
          })
        )
        navigate("/")
      }
    })
  }

  const handleRegister = (e) => {
    e.preventDefault()
    getUserByEmail(user.email).then((response) => {
      if (response.length > 0) {
        // Duplicate email. No good.
        window.alert("Account with that email address already exists")
      } else {
        // Good email, create user.
        registerNewUser()
      }
    })
  }

  const updateUser = (evt) => {
    const copy = { ...user }
    copy[evt.target.id] = evt.target.value
    setUser(copy)
  }

  return (
    <main className="container-login mt-5 mx-auto pt-5">
      <form className="form-login mx-auto text-center" onSubmit={handleRegister}>
      <h1 className="text-center mb-5">Register Your Galvadia Armory Account</h1>
        <fieldset>
          <div className="form-group">
            <input
              style={{fontFamily: user.name.length > 0 ? 'serif' : 'Cinzel'}}
              onChange={updateUser}
              type="text"
              id="name"
              className="form-control  mx-auto"
              placeholder="Name"
              required
              autoFocus
            />
          </div>
        </fieldset>
        <fieldset>
          <div className="form-group">
            <input
              style={{fontFamily: user.userName.length > 0 ? 'serif' : 'Cinzel'}}
              onChange={updateUser}
              type="text"
              id="userName"
              className="form-control  mx-auto"
              placeholder="Username"
              required
              autoFocus
            />
          </div>
        </fieldset>
        <fieldset>
          <div className="form-group">
            <input
              style={{fontFamily: user.email.length > 0 ? 'serif' : 'Cinzel'}}
              onChange={updateUser}
              type="email"
              id="email"
              className="form-control mx-auto"
              placeholder="Email address"
              required
            />
          </div>
        </fieldset>
        <fieldset>
          <div className="form-group">
            <input
              style={{fontFamily: user.password.length > 0 ? 'serif' : 'Cinzel'}}
              onChange={updateUser}
              type="password"
              id="password"
              className="form-control mx-auto"
              placeholder="Password"
              required
            />
          </div>
        </fieldset>
        <fieldset>
          <div className="form-group">
            <button className="mt-3 login btn fw-bold" type="submit">
              Register
            </button>
          </div>
        </fieldset>
      </form>
    </main>
  )
}
