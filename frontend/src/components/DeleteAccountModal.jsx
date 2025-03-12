import React, { useState } from "react";
import Loader from "./Loader"; 
import toast from "react-hot-toast";
import axios from "axios";
import { useDispatch } from "react-redux";
import { removeUser } from "../reducers/auth/authSlice";
import { apiRequest } from "../api/api";
import { useModal } from "../context/ModalContext";

function DeleteAccountModal() {

  const { showDeleteAccountModal, setShowDeleteAccountModal } = useModal();
  
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  async function handleDeleteAccount() {
      try {
        setLoading(true);
        const res = await apiRequest({
          method: 'post',
          url: `${import.meta.env.VITE_SERVER_URL}/account`
        });
        if (res.status === 200) {
          dispatch(removeUser());
          toast.success("Account deleted succesfully");
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to delete account");
      } finally {
        setLoading(false);
      }
    }

  if (!showDeleteAccountModal) return null;

  return (
    <div onClick={() => setShowDeleteAccountModal(false)} className="fixed top-0 left-0 z-[100] w-full h-full bg-black/50 flex items-center justify-center">
      <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-md shadow-md py-10 px-20">
        <h2 className="text-lg font-medium mb-4">Confirm Delete Account</h2>
        <p className="flex flex-col text-sm text-gray-500 mb-6">
          <span>Are you sure you want to delete your account? </span>
          <span>This action cannot be undone.</span>
        </p>
        <div className="flex justify-center space-x-4">
          <button
            disabled={loading}
            onClick={() => setShowDeleteAccountModal(false)}
            className="px-6 py-2 text-gray-600 font-medium rounded-sm"
          >
            Cancel
          </button>
          <button
            disabled={loading}
            onClick={() => {
              handleDeleteAccount();
              setShowDeleteAccountModal(false);
            }}
            className={`w-24 px-6 py-2 ${loading ? 'outline outline-2 outline-red-500' : 'bg-red-500'} text-white font-medium rounded-sm`}
          >
            {loading ? <Loader size='15px' borderWidth='2px' /> : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteAccountModal;
