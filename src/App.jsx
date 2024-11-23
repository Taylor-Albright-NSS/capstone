import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Login } from './components/auth/Login'
import { Register } from './components/auth/Register'
import { Authorized } from './views/Authorized'
import { ApplicationViews } from './views/ApplicationViews'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'

function App() {
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
