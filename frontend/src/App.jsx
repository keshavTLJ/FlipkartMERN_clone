import React,{ useState,useEffect } from 'react'
import './App.css'
import Header from './components/Header'
import Home from './pages/home/Home'
import Cart from './pages/cart/Cart'
import Login from './components/Login'
import ProductDetails from './pages/ProductDetails'
import Wishlist from './pages/Wishlist'
import Fashion from './pages/Fashion'
import SearchResults from './pages/SearchResults'
import Success from './pages/Success'
import Cancel from './pages/Cancel'
import Profile from './pages/profile/Profile'
import Orders from './pages/order/Orders'
import ContentWrapper from './components/ContentWrapper'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { verifyAuthAsync } from './reducers/auth/authSlice'
import Checkout from './pages/checkout/Checkout'
import CheckoutModal from './components/CheckoutModal'
import OrderDetails from './pages/order/OrderDetails'
import { Toaster } from "react-hot-toast"
import DeleteAccountModal from './components/DeleteAccountModal'
import StripePaymentInfoModal from './components/StripePaymentInfoModal'

function App() {

  const dispatch = useDispatch();

  // verifying Auth token on reload
  useEffect(() => {
    dispatch(verifyAuthAsync());
  }, []);

  return (
    <BrowserRouter>
      <div>
        <Toaster position="top-center"
          toastOptions={{
            duration: 2700,
            style: {
              position: 'relative',
              top: '3rem',
              backgroundColor: "#333333",
              color: "white",
              borderRadius: '3px'
            }
          }} />
        <Header />
        <Login />
        <ContentWrapper>
          <Routes>
            <Route path='/' exact element={<Home />} />
            <Route path='/products/:id' element={<ProductDetails />} />
            <Route path='/cart' element={<Cart />} />
            <Route path='/wishlist' element={<Wishlist />} />
            <Route path='/fashion/:category?' element={<Fashion />} />
            <Route path='/search' element={<SearchResults />} />
            <Route path='/account' element={<Profile />} />
            <Route path='/orders' element={<Orders />} />
            <Route path='/order' element={<OrderDetails />} />
            <Route path='/Checkout' element={<Checkout />} />
            <Route path='/success' element={<Success />} />
            <Route path='/cancel' element={<Cancel />} />
          </Routes>
        </ContentWrapper>
        <CheckoutModal />
        <DeleteAccountModal />
        <StripePaymentInfoModal />
      </div>
    </BrowserRouter>
  )
}

export default App;