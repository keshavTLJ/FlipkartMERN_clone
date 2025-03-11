import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BsBoxSeam } from "react-icons/bs";
import { IoSettingsOutline } from "react-icons/io5";
import { IoMdPower } from "react-icons/io";
import { FaGreaterThan } from "react-icons/fa6";
import PersonalInfo from './PersonalInfo';
import ManageAddresses from './ManageAddresses';
import { removeUser } from '../../reducers/auth/authSlice';
import { resetWishlist } from '../../reducers/wishlist/wishlistSlice';
import { resetCart } from '../../reducers/cart/cartSlice';
import { apiRequest } from '../../api/api';

function Profile() {

  const { currentUser, loading: authLoading } = useSelector((state) => state.auth);
  const [userData, setUserData] = useState(null);
  const [userDataLoading, setUserDataLoading] = useState(false);
  const [activeSettingNav, setActiveSettingNav] = useState('personalInfo');

  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  useEffect(() => {
    async function getUserData() {
      try {
        setUserDataLoading(true);
        const res = await apiRequest({
          method: 'get',
          url: `${import.meta.env.VITE_SERVER_URL}/account`, 
        });
        setUserData(res?.data);
        // setDataInForm()
      } catch (error) {
          console.log(error);
      } finally {
        setUserDataLoading(false);
      }
    }

    if (authLoading === false) {
      if (currentUser?.name) {
        getUserData();
      } 
      else {
        navigate("/");
        // toast.error('Login required')
      }
    }

  }, [authLoading, currentUser.name])

  const accountSettingsNav = [
    { 
      id: 'personalInfo', 
      title: "Profile Information", 
      referComponent: <PersonalInfo userData={userData} setUserData={setUserData} userDataLoading={userDataLoading} /> 
    },
    { 
      id: 'addresses', 
      title: "Manage Addresses", 
      referComponent: <ManageAddresses /> 
    }
  ]

  const handleLogout = () => {
    dispatch(removeUser("logout"));
    dispatch(resetWishlist());
    dispatch(resetCart());
  }
  
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#F1F3F6] py-4">
      <div className="max-w-[75rem] mx-auto grid grid-cols-4 gap-4">
        {/* Left Sidebar */}
        <div className="col-span-1 space-y-4">
          {/* User Info Card */}
          <div className="rounded">
            <div className="bg-white p-4 flex items-center space-x-3 pb-4 border-b shadow">
              {/* <FaUserCircle className="w-11 h-11 text-gray-600" /> */}
              <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/profile-pic-male_4811a1.svg" alt="" />
              <div>
                <p className="text-xs text-gray-600 text-left">Hello,</p>
                <p className="font-medium">{userData?.name}</p>
              </div>
            </div>
            
            <nav className="bg-white py-4 mt-4 space-y-2 shadow">
              <Link to="/orders" className="group flex justify-between items-center py-2 px-5 rounded">
                <span className='flex items-center space-x-3'>
                  <BsBoxSeam className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-500 font-medium group-hover:text-blue-500">MY ORDERS</span>
                </span>
                <FaGreaterThan className='text-gray-500' />
              </Link>
              
              <div className="border-t py-2 flex flex-col items-start">
                <div className="flex items-center space-x-3 py-2 px-5 rounded">
                  <IoSettingsOutline className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-500 font-medium">ACCOUNT SETTINGS</span>
                </div>
                <div className="mt-2 w-full">
                  {accountSettingsNav.map(setting => 
                    <div 
                      key={setting.id} 
                      onClick={() => setActiveSettingNav(setting.id)} 
                      className={`w-full flex justify-start py-3 text-sm cursor-pointer hover:text-blue-400 hover:bg-blue-50 ${setting.id === activeSettingNav && 'text-blue-500 bg-blue-50 font-medium'}`}
                    >
                      <span className='pl-[52px]'>{setting.title}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="border-t pt-2">
                <div onClick={handleLogout} className="group flex items-center space-x-3 py-2 px-5 rounded cursor-pointer">
                  <IoMdPower className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-500 font-medium hover:text-blue-500 group-hover:text-blue-500">Logout</span>
                </div>
              </div>
            </nav>
          </div>
        </div>

        {/* Main Content */} 
        <div className="col-span-3">
            {/* setting */}
            {accountSettingsNav.find(setting => setting.id === activeSettingNav)?.referComponent}
        </div>
      </div>
    </div>
  );
}

export default Profile;