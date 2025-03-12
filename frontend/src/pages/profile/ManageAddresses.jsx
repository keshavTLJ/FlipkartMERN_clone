import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Loader from '../../components/Loader';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../../api/api';

const indianStates = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand",
  "Karnataka", "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan",
  "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttarakhand", "Uttar Pradesh", "West Bengal",   
];

function ManageAddresses() {

  const currentUser = useSelector(state => state.auth.currentUser);
  const [addressList, setAddressList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addressAddUpdateLoading, setAddressAddUpdateLoading] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    mobNum: "",
    pincode: "",
    locality: "",
    address: "",
    city: "",
    state: "",
    addressType: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleShowAddressForm = () => {
    setAddressList(prevAddresses => 
      prevAddresses.map(address => ({
        ...address, editing: false
      }))
    );
    setFormData({ name: "", mobNum: "", pincode: "", locality: "", address: "", city: "", state: "", addressType: "" });
    setShowAddressForm(true);
  }

  const handleCloseForm = () => {
    setShowAddressForm(false);
    setFormData({ name: "", mobNum: "", pincode: "", locality: "", address: "", city: "", state: "", addressType: "" });
  }

  const handleCloseEditForm = (id) => {
    setAddressList(prevAddresses => 
      prevAddresses.map(address => ({
        ...address, editing: false
      }))
    );
    setFormData({ name: "", mobNum: "", pincode: "", locality: "", address: "", city: "", state: "", addressType: "" });
  }

  // Handle editing an address
  const handleEditAddress = (e, id) => {
    e.stopPropagation();
    setShowAddressForm(false);
    const addressToEdit = addressList.find((address) => address._id === id);
    if (addressToEdit) {
      setFormData({
        name: addressToEdit.name,
        mobNum: addressToEdit.mobNum,
        pincode: addressToEdit.pincode,
        locality: addressToEdit.locality,
        address: addressToEdit.address,
        city: addressToEdit.city,
        state: addressToEdit.state,
        addressType: addressToEdit.addressType
      });
    };

    setAddressList(prevAddresses => 
      prevAddresses.map(address => ({
        ...address, editing: address._id === id
      }))
    );
  };

  const handleSubmitForNewAddress = async (e) => {
    e.preventDefault();
    // console.log("Form Submitted", formData);
    try {
      setAddressAddUpdateLoading(true);
      const res = await apiRequest({
        method: 'post',
        url: `${import.meta.env.VITE_SERVER_URL}/user-address`, 
        data: { address: formData }, 
      });
      const { newAddress } = res?.data;
      setAddressList(prevAddresses => [newAddress, ...prevAddresses]);
      setFormData({ name: "", mobNum: "", pincode: "", locality: "", address: "", city: "", state: "", addressType: "" });
      setShowAddressForm(false);
      toast.success('New Address added');
    } catch (error) {
      console.log(error)
      toast.error('Adress not added');
    } finally {
      setAddressAddUpdateLoading(false);
    }
  };

  const handleSubmitForEditAddress = async (e, addressId) => {
    e.preventDefault();
    // console.log("Form Submitted", formData, addressId);
    try {
      setAddressAddUpdateLoading(true);
      const res = await apiRequest({
        method: 'patch',
        url: `${import.meta.env.VITE_SERVER_URL}/user-address/${addressId}`,
        data: { address: formData }
      });
      const { updatedAddress } = res?.data;
      setAddressList(prevAddresses => 
        prevAddresses.map(addr => addr._id === updatedAddress._id ? updatedAddress : addr)
      );
      setFormData({ name: "", mobNum: "", pincode: "", locality: "", address: "", city: "", state: "", addressType: "" });
      setShowAddressForm(false);
      toast.success('Address updated succesfully');
    } catch (error) {
      console.log(error)
      toast.error('Address not updated');
    } finally {
      setAddressAddUpdateLoading(false);
    }
  };

  const handleDeleteAddress = async (e, addressId) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if(!token) return;
    
    try {
      const res = await apiRequest({
        method: 'delete',
        url: `${import.meta.env.VITE_SERVER_URL}/user-address/${addressId}`,
      });
      setAddressList(prevAddresses => 
        prevAddresses.filter(addr => addr._id !== addressId)
      );
      toast.success('Address deleted');
    } catch (error) {
      console.log(error)
      toast.error('Address not deleted');
    }
  }

  useEffect(() => {
    async function getAddresses() {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await apiRequest({
          method: 'get',
          url: `${import.meta.env.VITE_SERVER_URL}/user-address`
        });
        setAddressList(res?.data.addresses);
      } catch (error) {
          console.log(error);
      } finally {
        setLoading(false);
      }
    }

    if(currentUser.name)
      getAddresses();
    else
      navigate('/');

  }, [currentUser.name])

  if (loading) {
    return <Loader size='50px' style={{ marginTop: "240px" }} />
  }

  return (
    <div className="py-5 px-8 space-y-6 bg-white rounded-sm shadow-md">
      <div className="flex gap-6 items-center">
        <h2 className="text-lg font-medium">Manage Addresses</h2>
      </div>

      <div className=''>
        {!showAddressForm ? 
        (<button onClick={handleShowAddressForm} className="bg-white flex flex-row justify-start items-center gap-4 pl-3 py-[10px] text-blue-600 w-full border border-black/15 rounded-sm">
          <span className='text-2xl'>+</span>
          <span className='text-[13px] font-medium'>{addressList.length > 0 ? 'ADD A NEW ADDRESS' : 'ADD AN ADDRESS'}</span>
        </button>
        )
        :
        (<div className='relative bg-blue-50 flex flex-col items-start px-5 py-4 gap-5 border rounded-sm'>
          <span className='text-blue-500 text-sm font-medium'>ADD A NEW ADDRESS</span>
          <form onSubmit={handleSubmitForNewAddress} className="grid grid-cols-2 gap-4 w-3/4">
            <div className="relative col-span-1">
              <input
                required
                type="text"
                id="name"
                name="name"
                placeholder=" "
                value={formData.name}
                onChange={handleChange}
                className="peer w-full border pb-2 pt-5 px-4 text-sm outline-none focus:ring-[0.5px] focus:ring-blue-600 h-12"
              />
              <label
                htmlFor="name"
                className="absolute cursor-text text-black/50 dark:text-black/50 duration-[280ms] ease-in-out transform -translate-y-3 -translate-x-[4px] scale-[70%] top-3 left-5 origin-[0] peer-focus:left-[20px] peer-focus:-translate-y-3 peer-focus:scale-[75%] peer-focus:text-sm peer-focus:text-black/50 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-1 peer-placeholder-shown:text-black/50 peer-placeholder-shown:text-sm"
              >
                Name
              </label>
            </div>
            <div className="relative col-span-1">
              <input
                required
                type="number"
                id="mobile"
                // pattern="[6-9]{10}"
                name="mobNum"
                placeholder=" "
                value={formData.mobNum}
                onChange={handleChange}
                className="peer w-full border pb-2 pt-5 px-4 text-sm outline-none focus:ring-[0.5px] focus:ring-blue-600 h-12 placeholder-black/50 placeholder:text-sm placeholder:pl-2"
                min={1}
                onInput={(e) => {
                  if (e.target.value.length > 10)
                    e.target.value = e.target.value.slice(0, 10);
                }}
              />
              <label
                htmlFor="mobile"
                className="absolute cursor-text text-black/50 dark:text-black/50 duration-[280ms] ease-in-out transform -translate-y-3 -translate-x-[4px] scale-[70%] top-3 left-5 origin-[0] peer-focus:left-[20px] peer-focus:-translate-y-3 peer-focus:scale-[75%] peer-focus:text-sm peer-focus:text-black/50 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-1 peer-placeholder-shown:text-black/50 peer-placeholder-shown:text-sm"
              >
                10-digit mobile number
              </label>
            </div>
            <div className="relative col-span-1">
              <input
                required
                type="number"
                id="pincode"
                name="pincode"
                placeholder=" "
                value={formData.pincode}
                onChange={handleChange}
                className="peer w-full border pb-2 pt-5 px-4 text-sm outline-none focus:ring-[0.5px] focus:ring-blue-600 h-12 placeholder-black/50 placeholder:text-sm placeholder:pl-2"
                min={1}
                onInput={(e) => {
                  if (e.target.value.length > 6)
                    e.target.value = e.target.value.slice(0, 6);
                }}
              />
              <label
                htmlFor="pincode"
                className="absolute cursor-text text-black/50 dark:text-black/50 duration-[280ms] ease-in-out transform -translate-y-3 -translate-x-[4px] scale-[70%] top-3 left-5 origin-[0] peer-focus:left-[20px] peer-focus:-translate-y-3 peer-focus:scale-[75%] peer-focus:text-sm peer-focus:text-black/50 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-1 peer-placeholder-shown:text-black/50 peer-placeholder-shown:text-sm"
              >
                Pincode
              </label>
            </div>
            <div className="relative col-span-1">
              <input
                required
                type="text"
                id="locality"
                name="locality"
                placeholder=" "
                value={formData.locality}
                onChange={handleChange}
                className="peer w-full border pb-2 pt-5 px-4 text-sm outline-none focus:ring-[0.5px] focus:ring-blue-600 h-12 placeholder-black/50 placeholder:text-sm placeholder:pl-2"
              />
              <label
                htmlFor="locality"
                className="absolute cursor-text text-black/50 dark:text-black/50 duration-[280ms] ease-in-out transform -translate-y-3 -translate-x-[4px] scale-[70%] top-3 left-5 origin-[0] peer-focus:left-[20px] peer-focus:-translate-y-3 peer-focus:scale-[75%] peer-focus:text-sm peer-focus:text-black/50 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-1 peer-placeholder-shown:text-black/50 peer-placeholder-shown:text-sm"
              >
                Locality
              </label>
            </div>
            <div className="relative col-span-2">
              <textarea
                name="address"
                id="address"
                placeholder=" "
                value={formData.address}
                onChange={handleChange}
                className="peer w-full border pb-2 pt-5 px-4 text-sm outline-none focus:ring-[0.5px] focus:ring-blue-600 placeholder-black/50 placeholder:text-sm placeholder:pl-2 h-20 resize-none"
              ></textarea>
              <label
                htmlFor="address"
                className="absolute cursor-text text-black/50 dark:text-black/50 duration-[280ms] ease-in-out transform -translate-y-3 -translate-x-[4px] scale-[70%] top-3 left-5 origin-[0] peer-focus:left-[20px] peer-focus:-translate-y-3 peer-focus:scale-[75%] peer-focus:text-sm peer-focus:text-black/50 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-1 peer-placeholder-shown:text-black/50 peer-placeholder-shown:text-sm"
              >
                Address (Area and Street)
              </label>
            </div>
            <div className="relative col-span-1">
            <input
              required
              type="text"
              name="city"
              placeholder=" "
              value={formData.city}
              onChange={handleChange}
              className="peer w-full border pb-2 pt-5 px-4 text-sm outline-none focus:ring-[0.5px] focus:ring-blue-600 h-12 placeholder-black/50 placeholder:text-sm placeholder:pl-2"
            />
              <label
                htmlFor="city"
                className="absolute cursor-text text-black/50 dark:text-black/50 duration-[280ms] ease-in-out transform -translate-y-3 -translate-x-[4px] scale-[70%] top-3 left-5 origin-[0] peer-focus:left-[20px] peer-focus:-translate-y-3 peer-focus:scale-[75%] peer-focus:text-sm peer-focus:text-black/50 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-1 peer-placeholder-shown:text-black/50 peer-placeholder-shown:text-sm"
              >
                City
              </label>
            </div>
            <div className="relative col-span-1">
              <select
                required
                name="state"
                id="state"
                value={formData.state}
                onChange={handleChange}
                className="relative border pb-2 pt-5 px-4 text-sm text-black/80 h-12 w-full"
              >
                <option value="" className="text-sm text-black/50">--Select State--</option>
                {indianStates.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
              <label 
                htmlFor="state"
                className="absolute top-1 left-5 text-xs text-black/50"
              >
                State
              </label>
            </div>
            <div className="col-span-2 flex flex-col items-start gap-3 px-3">
              <p className="text-xs text-black/50">
                Address Type
              </p>
              <div className="flex flex-row w-full gap-8">
                <label className="flex flex-row items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="addressType"
                    id="home"
                    value="home"
                    checked={formData.addressType === "home"}
                    onChange={handleChange}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <span htmlFor="home" className="text-sm">
                    Home
                  </span>
                </label>
                <label className="flex flex-row items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="addressType"
                    id="work"
                    value="work"
                    checked={formData.addressType === "work"}
                    onChange={handleChange}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <span htmlFor="work" className="text-sm">
                    Work
                  </span>
                </label>
              </div>
            </div>
            <div className="col-span-2 flex gap-9 mt-3">
              <button
                disabled={addressAddUpdateLoading}
                className={`${addressAddUpdateLoading ? "outline outline-2 outline-[#2874f0]" : "bg-[#2874f0]"} 
                text-white text-sm py-[14px] w-[15.5rem] font-semibold rounded-sm`}
              >
                {!addressAddUpdateLoading ? ("SAVE") 
                  : (
                  <Loader size="20px" borderWidth="3px" />
                )}
              </button>
              {!addressAddUpdateLoading && (
                <button
                  type="button"
                  className="text-blue-600 text-sm font-semibold"
                  onClick={handleCloseForm}
                >
                  CANCEL
                </button>
              )}
            </div>
          </form>
        </div> 
        )}
      </div>

      <div className='divide-y-[1px] border'>
        {addressList.length > 0 ? (
          addressList.map(address => (
            !address.editing ? (
              <div key={address._id} className={`flex flex-row items-start p-4`}>
                  <div className="w-full flex flex-col items-start gap-2 pl-1 py-[2px]">
                    <p className='w-full flex flex-row justify-between items-center'>
                      <span className="text-[10px] text-black/40 font-bold bg-black/5 px-2 py-1 rounded-sm">{address.addressType?.toUpperCase()}</span>
                      <span className='relative group px-3 py-1'>
                        <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjE2IiB2aWV3Qm94PSIwIDAgNCAxNiI+CiAgICA8ZyBmaWxsPSIjODc4Nzg3IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxjaXJjbGUgY3g9IjIiIGN5PSIyIiByPSIyIi8+CiAgICAgICAgPGNpcmNsZSBjeD0iMiIgY3k9IjgiIHI9IjIiLz4KICAgICAgICA8Y2lyY2xlIGN4PSIyIiBjeT0iMTQiIHI9IjIiLz4KICAgIDwvZz4KPC9zdmc+Cg==" alt="" />
                        <span className='absolute min-w-20 border shadow-md text-sm -top-1 right-2 rounded bg-white hidden group-hover:flex flex-col items-start'>
                          <span onClick={(e) => handleEditAddress(e, address._id)} className='w-full px-4 pt-3 pb-2 text-start hover:text-blue-500 cursor-pointer'>Edit</span>
                          <span onClick={(e) => handleDeleteAddress(e, address._id)} className='w-full px-4 pt-2 pb-3 text-start hover:text-blue-500 cursor-pointer'>Delete</span>
                        </span>
                      </span>
                    </p>
                    <p className='flex flex-row items-center gap-3'>
                      <span className="text-sm font-semibold">{address.name}</span>
                      <span className='text-sm font-semibold'>{address.mobNum}</span>
                    </p>
                    <p>
                      <span className='text-sm'>{`${address.address}, ${address.locality}, ${address.city}, ${address.state} - `}</span>
                      <span className='text-sm font-medium'>{address.pincode}</span>
                    </p>
                  </div>
              </div>
            ) :
            (
              <div className='relative bg-blue-50 flex flex-col items-start px-5 py-4 gap-5 rounded-sm'>
                <span className='text-blue-500 text-sm font-medium'> EDIT ADDRESS</span>
                <form onSubmit={(e) => handleSubmitForEditAddress(e, address._id)} className="grid grid-cols-2 gap-4 w-3/4">
                  <div className="relative col-span-1">
                    <input
                      required
                      type="text"
                      id="name"
                      name="name"
                      placeholder=" "
                      value={formData.name}
                      onChange={handleChange}
                      className="peer w-full border pb-2 pt-5 px-4 text-sm outline-none focus:ring-[0.5px] focus:ring-blue-600 h-12"
                    />
                    <label
                      htmlFor="name"
                      className="absolute cursor-text text-black/50 dark:text-black/50 duration-[280ms] ease-in-out transform -translate-y-3 -translate-x-[4px] scale-[70%] top-3 left-5 origin-[0] peer-focus:left-[20px] peer-focus:-translate-y-3 peer-focus:scale-[75%] peer-focus:text-sm peer-focus:text-black/50 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-1 peer-placeholder-shown:text-black/50 peer-placeholder-shown:text-sm"
                    >
                      Name
                    </label>
                  </div>
                  <div className="relative col-span-1">
                    <input
                      required
                      type="number"
                      id="mobile"
                      // pattern="[6-9]{10}"
                      name="mobNum"
                      placeholder=" "
                      value={formData.mobNum}
                      onChange={handleChange}
                      className="peer w-full border pb-2 pt-5 px-4 text-sm outline-none focus:ring-[0.5px] focus:ring-blue-600 h-12 placeholder-black/50 placeholder:text-sm placeholder:pl-2"
                      min={1}
                      onInput={(e) => {
                        if (e.target.value.length > 10)
                          e.target.value = e.target.value.slice(0, 10);
                      }}
                    />
                    <label
                      htmlFor="mobile"
                      className="absolute cursor-text text-black/50 dark:text-black/50 duration-[280ms] ease-in-out transform -translate-y-3 -translate-x-[4px] scale-[70%] top-3 left-5 origin-[0] peer-focus:left-[20px] peer-focus:-translate-y-3 peer-focus:scale-[75%] peer-focus:text-sm peer-focus:text-black/50 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-1 peer-placeholder-shown:text-black/50 peer-placeholder-shown:text-sm"
                    >
                      10-digit mobile number
                    </label>
                  </div>
                  <div className="relative col-span-1">
                    <input
                      required
                      type="number"
                      id="pincode"
                      name="pincode"
                      placeholder=" "
                      value={formData.pincode}
                      onChange={handleChange}
                      className="peer w-full border pb-2 pt-5 px-4 text-sm outline-none focus:ring-[0.5px] focus:ring-blue-600 h-12 placeholder-black/50 placeholder:text-sm placeholder:pl-2"
                      min={1}
                      onInput={(e) => {
                        if (e.target.value.length > 6)
                          e.target.value = e.target.value.slice(0, 6);
                      }}
                    />
                    <label
                      htmlFor="pincode"
                      className="absolute cursor-text text-black/50 dark:text-black/50 duration-[280ms] ease-in-out transform -translate-y-3 -translate-x-[4px] scale-[70%] top-3 left-5 origin-[0] peer-focus:left-[20px] peer-focus:-translate-y-3 peer-focus:scale-[75%] peer-focus:text-sm peer-focus:text-black/50 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-1 peer-placeholder-shown:text-black/50 peer-placeholder-shown:text-sm"
                    >
                      Pincode
                    </label>
                  </div>
                  <div className="relative col-span-1">
                    <input
                      required
                      type="text"
                      id="locality"
                      name="locality"
                      placeholder=" "
                      value={formData.locality}
                      onChange={handleChange}
                      className="peer w-full border pb-2 pt-5 px-4 text-sm outline-none focus:ring-[0.5px] focus:ring-blue-600 h-12 placeholder-black/50 placeholder:text-sm placeholder:pl-2"
                    />
                    <label
                      htmlFor="locality"
                      className="absolute cursor-text text-black/50 dark:text-black/50 duration-[280ms] ease-in-out transform -translate-y-3 -translate-x-[4px] scale-[70%] top-3 left-5 origin-[0] peer-focus:left-[20px] peer-focus:-translate-y-3 peer-focus:scale-[75%] peer-focus:text-sm peer-focus:text-black/50 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-1 peer-placeholder-shown:text-black/50 peer-placeholder-shown:text-sm"
                    >
                      Locality
                    </label>
                  </div>
                  <div className="relative col-span-2">
                    <textarea
                      name="address"
                      id="address"
                      placeholder=" "
                      value={formData.address}
                      onChange={handleChange}
                      className="peer w-full border pb-2 pt-5 px-4 text-sm outline-none focus:ring-[0.5px] focus:ring-blue-600 placeholder-black/50 placeholder:text-sm placeholder:pl-2 h-20 resize-none"
                    ></textarea>
                    <label
                      htmlFor="address"
                      className="absolute cursor-text text-black/50 dark:text-black/50 duration-[280ms] ease-in-out transform -translate-y-3 -translate-x-[4px] scale-[70%] top-3 left-5 origin-[0] peer-focus:left-[20px] peer-focus:-translate-y-3 peer-focus:scale-[75%] peer-focus:text-sm peer-focus:text-black/50 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-1 peer-placeholder-shown:text-black/50 peer-placeholder-shown:text-sm"
                    >
                      Address (Area and Street)
                    </label>
                  </div>
                  <div className="relative col-span-1">
                    <input
                      required
                      type="text"
                      name="city"
                      placeholder=" "
                      value={formData.city}
                      onChange={handleChange}
                      className="peer w-full border pb-2 pt-5 px-4 text-sm outline-none focus:ring-[0.5px] focus:ring-blue-600 h-12 placeholder-black/50 placeholder:text-sm placeholder:pl-2"
                    />
                    <label
                      htmlFor="city"
                      className="absolute cursor-text text-black/50 dark:text-black/50 duration-[280ms] ease-in-out transform -translate-y-3 -translate-x-[4px] scale-[70%] top-3 left-5 origin-[0] peer-focus:left-[20px] peer-focus:-translate-y-3 peer-focus:scale-[75%] peer-focus:text-sm peer-focus:text-black/50 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-1 peer-placeholder-shown:text-black/50 peer-placeholder-shown:text-sm"
                    >
                      City
                    </label>
                  </div>
                  <div className="relative col-span-1">
                    <select
                      required
                      name="state"
                      id="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="relative border pb-2 pt-5 px-4 text-sm text-black/80 h-12 w-full"
                    >
                      <option value="" className="text-sm text-black/50">--Select State--</option>
                      {indianStates.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                    <label 
                      htmlFor="state"
                      className="absolute top-1 left-5 text-xs text-black/50"
                    >
                      State
                    </label>
                  </div>
                  <div className="col-span-2 flex flex-col items-start gap-3 px-3">
                    <p className="text-xs text-black/50">
                      Address Type
                    </p>
                    <div className="flex flex-row w-full gap-8">
                      <label className="flex flex-row items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="addressType"
                          id="home"
                          value="home"
                          checked={formData.addressType === "home"}
                          onChange={handleChange}
                          className="w-4 h-4 cursor-pointer"
                        />
                        <span htmlFor="home" className="text-sm ">
                          Home
                        </span>
                      </label>
                      <label className="flex flex-row items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="addressType"
                          id="work"
                          value="work"
                          checked={formData.addressType === "work"}
                          onChange={handleChange}
                          className="w-4 h-4 cursor-pointer"
                        />
                        <span htmlFor="work" className="text-sm">
                          Work
                        </span>
                      </label>
                    </div>
                  </div>
                  <div className="col-span-2 flex gap-9 mt-3">
                    <button
                      disabled={addressAddUpdateLoading}
                      className={`${addressAddUpdateLoading ? "outline outline-2 outline-[#2874f0]" : "bg-[#2874f0]"} 
                        text-white text-sm py-[14px] w-[15.5rem] font-semibold rounded-sm`}
                    >
                      {!addressAddUpdateLoading ? ("SAVE") 
                        : (
                        <Loader size="20px" borderWidth="3px" />
                      )}
                    </button>
                    {!addressAddUpdateLoading && (
                      <button
                        type="button"
                        className="text-blue-600 text-sm font-semibold"
                        onClick={() => handleCloseEditForm(address._id)}
                      >
                        CANCEL
                      </button>
                    )}
                  </div>
                </form>
              </div>
            )
            ))
        )
        :
        (<div className="flex flex-col items-center justify-center p-6 rounded-md bg-gray-50 text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6 mb-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5c0-2.62 1.44-4.857 3.75-6.035 2.1-1.078 4.5-1.078 6.6 0C18.06 5.643 19.5 7.88 19.5 10.5z"
              />
            </svg>
            <p className="text-sm font-medium">No address added</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ManageAddresses