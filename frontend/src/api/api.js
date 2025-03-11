import axios from 'axios';
import toast from 'react-hot-toast';

const BASE_URL = import.meta.env.VITE_SERVER_URL;

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 6000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiRequest = async (config = {}, requiresAuth = true) => {
  // console.log("config: ", config);
  try {
    let authHead = {};
    if(requiresAuth) {
      const token = localStorage.getItem('token')?.trim();
      if(!token) {
        // throw new Error("No token found");
        // toast.error('Login required');
        return;
      }
      authHead = { Authorization: `Bearer ${token}` };
    }
    
    const res = await api({ ...config, headers: authHead });
    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
};