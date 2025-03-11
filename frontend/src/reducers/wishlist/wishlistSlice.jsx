import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { authUserAsync, verifyAuthAsync } from '../auth/authSlice'
import toast from "react-hot-toast"
import { apiRequest } from '../../api/api'

const initialState = {
    wishlistProductIds: [],
    wishlistItems: [],
    // wishlistLength: null,
    loading: null,
    error: null
}

export const getWishlistItemsAsync = createAsyncThunk(
    "cart/getWishlistItems", 
    async (_, { rejectWithValue }) => {
        try {
            const res = await apiRequest({ 
                method: 'get', 
                url: `${import.meta.env.VITE_SERVER_URL}/wishlist`, 
            });
            return res?.data;
        } catch (error) {
            return rejectWithValue(error.response.data.error);
        }
    }
)

export const addWishlistItemAsync = createAsyncThunk(
    "cart/addWishlistItem",
    async (product, { rejectWithValue }) => {
        // const token = localStorage.getItem("token");
        try {
            const res = await apiRequest({ 
                method: 'post', 
                url: `${import.meta.env.VITE_SERVER_URL}/wishlist`, 
                data: { id: product._id }, 
            });
            // console.log(res)
            return res?.data.id;
        } catch (error) {
            return rejectWithValue(error.response.data.error);
        }
    }
)

export const deleteWishlistItemAsync = createAsyncThunk(
    "cart/deleteWishlistItem",
    async ({ product, fromWishlistPage }, { rejectWithValue }) => {
        // const token = localStorage.getItem("token");
        try {
            const res = await apiRequest({ 
                method: 'delete', 
                url: `${import.meta.env.VITE_SERVER_URL}/wishlist/${product._id}` 
            });
            return { data: res.data, fromWishlistPage, status: res.status };
        } catch (error) {
            return rejectWithValue(error.response.data.error);
        }
    }
)

export const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState,
    reducers: {
        deleteWishlistItemFromRedux: (state, action) => {
            state.wishlist = state.wishlist.filter(item => item.id !== action.payload.id)
        },
        resetWishlist: (state, action) => {
            state.wishlistProductIds = [];
        }
    },

    extraReducers: (builder) => {
        builder
            //getWishlistItems
            .addCase(getWishlistItemsAsync.pending, (state, action) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getWishlistItemsAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.wishlistItems = action.payload;
            })
            .addCase(getWishlistItemsAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload
            })
            
            //addWishlistItem
            .addCase(addWishlistItemAsync.pending, (state, action) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addWishlistItemAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.wishlistProductIds.unshift(action.payload);
                toast.success("Added to Wishlist!");
            })
            .addCase(addWishlistItemAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                toast.error(`Failed to add: ${action.payload}`);
            })

            //deleteWishlistItem
            .addCase(deleteWishlistItemAsync.pending, (state, action) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteWishlistItemAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                const { data, fromWishlistPage } = action.payload;
                state.wishlistProductIds = state.wishlistProductIds.filter(id => id !== data.id);
                if(fromWishlistPage)
                    state.wishlistItems = state.wishlistItems.filter(item => item._id !== data.id);
                // state.wishlistLength = data.wishlistLength;
                toast.success("Removed from Wishlist!");
            })
            .addCase(deleteWishlistItemAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                toast.error(`Failed to remove: ${action.payload}`);
            })
            
            .addCase(authUserAsync.fulfilled, (state, action) => {
                state.wishlistProductIds = action.payload.wishlistIds;
                // state.wishlistLength = action.payload.wishlistLength;
            })
            .addCase(verifyAuthAsync.fulfilled, (state, action) => {
                state.wishlistProductIds = action.payload.wishlistIds;
                // state.wishlistLength = action.payload.wishlistLength;
            })
        }
})

export const { deleteWishlistItemFromRedux, resetWishlist } = wishlistSlice.actions;

export default wishlistSlice.reducer;