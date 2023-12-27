import React from 'react'
import { Routes, Route } from 'react-router-dom'
import LoginForm from './components/LoginForm'
import Home from './components/Home'



const App = () => (

  <Routes>
    <Route path="/login" element={<LoginForm />} />
    <Route path="/" element={<Home />} />
  </Routes>

)


export default App