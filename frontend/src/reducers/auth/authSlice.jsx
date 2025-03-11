import { createAsyncThunk, createSlice, isRejectedWithValue } from '@reduxjs/toolkit'
import axios from 'axios';
import toast from "react-hot-toast"
import { apiRequest } from '../../api/api';

const initialState = {
  currentUser: {},
  loading: null,
  error: null
}

//common thunk middleware for signup and login based on 'type'(signup or login)
export const authUserAsync = createAsyncThunk(
  'auth/authUser',
  async ({ type, input }, { rejectWithValue }) => {
    // console.log(type, input);
    try {
      const res = await apiRequest({ 
        method: 'post', 
        url: `/${type}`, 
        data: input
      }, false);
      return res?.data;
    } catch (error) {
      // console.log(error.response.data.error)
      return rejectWithValue(error.response.data.error)
    }
  }
);

export const verifyAuthAsync = createAsyncThunk(
  'auth/verifyAuth',
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiRequest({ 
        method: 'post', 
        url: '/verify-auth',
        data: {},
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Token verification failed");
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.currentUser.name = action.payload
    },
    //for user Log out
    removeUser: (state, action) => {
      localStorage.removeItem("token");
      state.currentUser = {};
      action.payload === "logout" && toast.success('Logout successful');
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    }
  },
  extraReducers: (builder) => {
    //authUser
    builder
    .addCase(authUserAsync.pending, (state, action) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(authUserAsync.fulfilled, (state, action) => {
      const { name, token, authType } = action.payload;

      state.loading = false;
      state.error = null;
      state.currentUser = { name: name.split(" ")[0] };
      localStorage.setItem("token", token);
      if(authType === 'signup') {
        toast.success('SignUp successful')
      }
      else if(authType === 'login') {
        toast.success('Login successful')
      }
    })
    .addCase(authUserAsync.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      toast.error('Authentication error!')
    })

    //verifyUser
    .addCase(verifyAuthAsync.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(verifyAuthAsync.fulfilled, (state, action) => {
      const { name, verified } = action.payload;
      state.loading = false;
      state.error = null;
      if(verified)
        state.currentUser = { name: name.split(" ")[0] };
    })
    .addCase(verifyAuthAsync.rejected, (state, action) => {
      state.loading = false;
      state.currentUser = {};
      // state.error = action.payload;
      localStorage.removeItem("token");
    });
  }
});

export const { setUser, removeUser, setError } = authSlice.actions

export default authSlice.reducer