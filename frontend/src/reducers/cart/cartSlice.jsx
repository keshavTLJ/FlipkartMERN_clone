import { createSlice, createAsyncThunk, current } from '@reduxjs/toolkit'
import axios from 'axios';
import { authUserAsync, verifyAuthAsync } from '../auth/authSlice';
import toast from "react-hot-toast"
import { apiRequest } from '../../api/api';

const initialState = {
    cartProductIds : [],
    cartItems: [],
    loading: null,
    deleteLoading: null,
    updateLoading: null,
    error: null
}

export const getCartItemsAsync = createAsyncThunk(
    "cart/getCartItems", 
    async (_, { rejectWithValue }) => {
        try {
            const res = await apiRequest({ 
                method: 'get', 
                url: `${import.meta.env.VITE_SERVER_URL}/cart`
            });
            // console.log(res?.data);
            return res?.data;
        } catch (error) {
            return rejectWithValue(error.response.data.error);
        }
    }
)

export const addCartItemAsync = createAsyncThunk(
    "cart/addCartItem",
    async (product, { rejectWithValue }) => {
        // const token = localStorage.getItem("token");
        try {
            const res = await apiRequest({
                method: 'post',
                url: `${import.meta.env.VITE_SERVER_URL}/cart`, 
                data: { id: product._id }, }
            );
            // console.log(res)
            return res?.data.id;
        } catch (error) {
            return rejectWithValue(error.response.data.error);
        }
    }
)

export const deleteCartItemAsync = createAsyncThunk(
    "cart/deleteCartItem",
    async ({ product, fromCartPage }, { rejectWithValue }) => {
        // const token = localStorage.getItem("token");
        try {
            const res = await apiRequest({ 
                method: 'delete', 
                url: `${import.meta.env.VITE_SERVER_URL}/cart/${product._id}` 
            });
            
            return { data: res.data, fromCartPage, status: res.status };
        } catch (error) {
            return rejectWithValue(error.response.data.error);
        }
    }
)

export const updateCartItemQuantityAsync = createAsyncThunk(
    "cart/updateCartItemQuantity",
    async ({ productId, newQuantity }, { rejectWithValue }) => {
        // const token = localStorage.getItem("token");
        try {
            const res = await apiRequest({
                method: 'patch',
                url:`${import.meta.env.VITE_SERVER_URL}/cart`, 
                data:{ 
                    id: productId,
                    quantity: newQuantity
                }, 
            });

            return { data: res?.data, status: res?.status };
        } catch (error) {
            return rejectWithValue(error.response.data.error);
        }
    }
)

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        incrementQuantity: (state, action) => {
            const item = state.cart.find(item => item.id === action.payload.id)
            item.quantity = item.quantity + 1
        },
        decrementQuantity: (state, action) => {
            const item = state.cart.find(item => item.id === action.payload.id)
            item.quantity = item.quantity - 1
        },
        resetCart: (state, action) => {
            state.cartProductIds = [];
        }
    },

    extraReducers: (builder) => {
        builder
            //getCartItems
            .addCase(getCartItemsAsync.pending, (state, action) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCartItemsAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.cartItems = action.payload;
            })
            .addCase(getCartItemsAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload
            })

            //addCartItem
            .addCase(addCartItemAsync.pending, (state, action) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addCartItemAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.cartProductIds.unshift(action.payload);
                toast.success("Added to Cart!");
            })
            .addCase(addCartItemAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                toast.error(`Failed to add: ${action.payload}`);
            })

            //deleteCartItem
            .addCase(deleteCartItemAsync.pending, (state, action) => {
                state.deleteLoading = true;
                state.error = null;
            })
            .addCase(deleteCartItemAsync.fulfilled, (state, action) => {
                state.deleteLoading = false;
                state.error = null;
                const { data, fromCartPage } = action.payload;
                state.cartProductIds = state.cartProductIds.filter(id => id !== data.id);
                if(fromCartPage)
                    state.cartItems = state.cartItems.filter(item => item.product._id !== data.id)
                toast.success("Removed from Cart!");
            })
            .addCase(deleteCartItemAsync.rejected, (state, action) => {
                state.deleteLoading = false;
                state.error = action.payload;
                toast.error(`Failed to remove: ${action.payload}`);
            })
            
            //updateQuantity
            .addCase(updateCartItemQuantityAsync.pending, (state, action) => {
                state.updateLoading = true;
                state.error = null;
            })
            .addCase(updateCartItemQuantityAsync.fulfilled, (state, action) => {
                state.updateLoading = false;
                state.error = null;
                const { data } = action.payload;
                state.cartItems = state.cartItems.map(item => {
                    if(item.product._id === data.id)
                      return { ...item, quantity: data.quantity };
                    return item;
                })
                // state.cartProductIds = state.cartProductIds.filter(id => id !== data.id)
            })
            .addCase(updateCartItemQuantityAsync.rejected, (state, action) => {
                state.updateLoading = false;
                state.error = action.payload;
            })
            
            .addCase(authUserAsync.fulfilled, (state, action) => {
                state.cartProductIds = action.payload.cartIds;
            })
            .addCase(verifyAuthAsync.fulfilled, (state, action) => {
                state.cartProductIds = action.payload.cartIds;
            });
    }
})

export const { incrementQuantity, decrementQuantity, deleteCartItemFromRedux, resetCart } = cartSlice.actions;

export default cartSlice.reducer;