import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../reducers/cart/cartSlice";
import wishlistReducer from "../reducers/wishlist/wishlistSlice";
import authReducer from "../reducers/auth/authSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
  }
});