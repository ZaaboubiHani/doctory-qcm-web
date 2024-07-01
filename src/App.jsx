import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import React, { useContext } from 'react';
import {
  BrowserRouter as Router,
  Route, Routes
} from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Categories from './pages/Categories';
import Modules from './pages/Modules';
import Courses from './pages/Courses';
import Snackbar from './components/Snackbar';
function App() {

  return <div className='overflow-hidden'>
  <Router className='relative'>
    <Routes >
      <Route path='/' element={<Login />} />
      <Route path='/signup' element={<Signup />} />
      <Route path='/categories' element={<Categories />} />
      <Route path='/modules/:id' element={<Modules />} />
      <Route path='/courses/:id' element={<Courses />} />
    </Routes>
    <Snackbar/>
  </Router>
</div>;
}

export default App
