import { useState } from 'react'
import { Routes, Route, Outlet } from 'react-router-dom'
import { Welcome } from './views/Welcome'
import { Login } from './components/auth/Login'
import { Register } from './components/auth/Register'
import { Authorized } from './views/Authorized'
import { ApplicationViews } from './views/ApplicationViews'
import 'bootstrap/dist/css/bootstrap.min.css'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Routes>
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />

      <Route path='*' element={
        <Authorized>
            <ApplicationViews />
        </Authorized>
      } />
    </Routes>
  )
}

export default App
