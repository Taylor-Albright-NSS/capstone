import React, { useState } from "react"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import "./Login.css"
import { getUserByEmailAndPassword } from "../../services/userServices"

export const Login = () => {
    const [userName, set] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()
  
    const handleLogin = (e) => {
      e.preventDefault()
  
      getUserByEmailAndPassword(userName, password).then((foundUsers) => {
        if (foundUsers.length === 1) {
          const user = foundUsers[0]
          localStorage.setItem(
            "capstone_user",
            JSON.stringify({
              id: user.id,
            })
          )
          navigate("/profile")
        } else {
          window.alert("Invalid login")
        }
      })
    }
  
    return (
      <main className="container-login mx-auto pt-5">
        <section className='login'>
          <form className="form-login mx-auto text-center" style={{ width: '500px'}} onSubmit={handleLogin}>
            <h1 className="text-center mb-5" style={{fontSize: '52px'}}>Welcome To The Galvadia Armory</h1>
            <fieldset>
              <div className="form-group">
                <input
                  style={{width: '300px', fontFamily: userName.length > 0 ? 'serif' : 'Cinzel'}}
                  type="text"
                  value={userName}
                  onChange={(evt) => set(evt.target.value)}
                  className="form-control mx-auto my-1"
                  placeholder="Username"
                  required
                  autoFocus
                />
              </div>
            </fieldset>
            <fieldset>
              <div className="form-group">
                <input
                  style={{width: '300px', fontFamily: userName.length > 0 ? 'serif' : 'Cinzel'}}
                  type="password"
                  value={password}
                  onChange={(evt) => setPassword(evt.target.value)}
                  className="form-control  mx-auto"
                  placeholder="Password"
                  required
                  autoFocus
                />
              </div>
            </fieldset>
            <fieldset>
              <div className="form-group">
                <button className="mt-3 mb-3 login btn btn-primary fw-bold" type="submit">
                  SUBMIT
                </button>
              </div>
              <Link to="/register" className="register">Not a member yet?</Link>
            </fieldset>
          </form>
        </section>
        <section className="text-center register mt-3">
        </section>
      </main>
    )
  }