import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from './components/Home'
import RestaurantDetailPage from './components/RestaurantDetailPage'
import UpdateRestaurant from './components/UpdateRestaurant'
const App = () => {
  return (
    <Router>

      <Routes>

        <Route path='/' element={<Home />} />
        <Route path='/restaurant/:id' element={<RestaurantDetailPage />} />
        <Route path='/restaurant/:id/update' element={<UpdateRestaurant />} />


      </Routes>

    </Router >
  )
}

export default App
