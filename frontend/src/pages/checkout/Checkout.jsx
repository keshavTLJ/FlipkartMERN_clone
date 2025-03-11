import React, { useEffect, useRef, useState } from "react";
import { FaCheck } from "react-icons/fa6";
import CartItem from "../cart/CartItem";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import Loader from "../../components/Loader";
import StripeCheckoutWrapper from "../../components/CheckoutButton";
import toast from "react-hot-toast";
import { apiRequest } from "../../api/api";
import { useModal } from "../../context/ModalContext";

const indianStates = [
  "Andaman and Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttarakhand",
  "Uttar Pradesh",
  "West Bengal",
];
const addressListFormat = [
  {
    _id: "67b08aa91fcaeb1ccbafe718",
    name: "Rahul Sharma",
    mobNum: "9876543210",
    pincode: "110001",
    locality: "Connaught Place",
    address: "12, Outer Circle, CP",
    city: "New Delhi",
    state: "Delhi",
    addressType: "home",
    editing: false,
  },
  {
    _id: "67b08aa91fcaeb1ccbafe719",
    name: "Priya Verma",
    mobNum: "9123456789",
    pincode: "400001",
    locality: "Colaba",
    address: "25, Marine Drive",
    city: "Mumbai",
    state: "Maharashtra",
    addressType: "work",
    editing: false,
  },
];

function Checkout() {

  const { setShowCheckoutModal, setShowStripePaymentInfoModal } = useModal();

  const { currentUser, loading: authLoading } = useSelector(state => state.auth);
  const [cartItems, setCartItems] = useState([]);
  const [fetchDataLoading, setFetchDataLoading] = useState(false);
  const [addressAddUpdateLoading, setAddressAddUpdateLoading] = useState(false);
  const [addressList, setAddressList] = useState([]);
  const [deliveryComponentActive, setDeliveryComponentActive] = useState(true);
  const [finalDeliveryAddress, setFinalDeliveryAddress] = useState(null);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [prevSelectedAddressId, setPrevSelectedAddressId] = useState(1);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    mobNum: "",
    pincode: "",
    locality: "",
    address: "",
    city: "",
    state: "",
    addressType: "",
  });

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const productId = searchParams.get("productId");

  const totalMrp = cartItems?.reduce(
    (acc, item) => acc + item.product.originalprice * item.quantity,
    0
  );
  const totalCost = cartItems?.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );
  const totalDiscount = totalMrp - totalCost;

  // Handle selecting an address
  const handleSelectAddress = (id) => {
    setAddressList((prevAddresses) =>
      prevAddresses.map((address) => ({
        ...address,
        editing: false,
      }))
    );
    setSelectedAddressId(id);
    if (showAddressForm) handleCloseForm();
  };

  // Handle editing an address
  const handleEditAddress = (e, id) => {
    e.stopPropagation();
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
        addressType: addressToEdit.addressType,
      });
    }

    setAddressList((prevAddresses) =>
      prevAddresses.map((address) => ({
        ...address,
        editing: address._id === id,
      }))
    );
  };

  const handleCloseEditForm = (id) => {
    setAddressList((prevAddresses) =>
      prevAddresses.map((address) => ({
        ...address,
        editing: false,
      }))
    );
    setFormData({
      name: "",
      mobNum: "",
      pincode: "",
      locality: "",
      address: "",
      city: "",
      state: "",
      addressType: "",
    });
  };

  function selectDeliveryAddress(addressId) {
    const deliveryAddress = addressList.find(
      (address) => address._id === addressId
    );
    // console.log(deliveryAddress);
    setFinalDeliveryAddress(deliveryAddress);
    setDeliveryComponentActive(false);
  }

  const handleOpenDeliveryComponent = () => {
    setDeliveryComponentActive(true);
    setFinalDeliveryAddress(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitForNewAddress = async (e) => {
    e.preventDefault();
    try {
      setAddressAddUpdateLoading(true);
      const res = await apiRequest({
        method: "post",
        url: `${import.meta.env.VITE_SERVER_URL}/user-address`,
        data: { address: formData },
      });
      const { newAddress } = res?.data;
      setAddressList((prevAddresses) => [newAddress, ...prevAddresses]);
      setFinalDeliveryAddress(newAddress);
      setSelectedAddressId(newAddress._id);
      setDeliveryComponentActive(false);
      setFormData({
        name: "",
        mobNum: "",
        pincode: "",
        locality: "",
        address: "",
        city: "",
        state: "",
        addressType: "",
      });
      setShowAddressForm(false);
      toast.success("Address added successfully");
    } catch (error) {
      console.log(error);
      toast.error("Address not added");
    } finally {
      setAddressAddUpdateLoading(false);
    }
  };

  const handleSubmitForEditAddress = async (e, addressId) => {
    e.preventDefault();
    try {
      setAddressAddUpdateLoading(true);
      const res = await apiRequest({
        method: "patch",
        url: `${import.meta.env.VITE_SERVER_URL}/user-address/${addressId}`,
        data: { address: formData },
      });
      const { updatedAddress } = res?.data;
      setAddressList((prevAddresses) =>
        prevAddresses.map((addr) =>
          addr._id === updatedAddress._id ? updatedAddress : addr
        )
      );
      setFinalDeliveryAddress(updatedAddress);
      setSelectedAddressId(updatedAddress._id);
      setDeliveryComponentActive(false);
      setFormData({
        name: "",
        mobNum: "",
        pincode: "",
        locality: "",
        address: "",
        city: "",
        state: "",
        addressType: "",
      });
      setShowAddressForm(false);
      toast.success("Address updated successfully");
    } catch (error) {
      console.log(error);
      toast.error("Address updation failed");
    } finally {
      setAddressAddUpdateLoading(false);
    }
  };

  const handleShowAddressForm = () => {
    setPrevSelectedAddressId(selectedAddressId);
    setSelectedAddressId(null);
    setFinalDeliveryAddress(null);
    setAddressList((prevAddresses) =>
      prevAddresses.map((address) => ({
        ...address,
        editing: false,
      }))
    );
    setFormData({
      name: "",
      mobNum: "",
      pincode: "",
      locality: "",
      address: "",
      city: "",
      state: "",
      addressType: "",
    });
    setShowAddressForm(true);
  };

  const handleCloseForm = () => {
    setShowAddressForm(false);
    setFormData({
      name: "",
      mobNum: "",
      pincode: "",
      locality: "",
      address: "",
      city: "",
      state: "",
      addressType: "",
    });
    setSelectedAddressId(prevSelectedAddressId);
  };

  async function updateQuantity(id, newQuantity) {
    setCartItems(
      cartItems.map((item) => {
        if (item.product._id === id) return { ...item, quantity: newQuantity };
        return item;
      })
    );
  }

  async function handleDelete(product) {
    const updatedCartItems = cartItems.filter(
      (item) => item.product._id !== product._id
    );
    setCartItems(updatedCartItems);
    if (updatedCartItems.length === 0) {
      setShowCheckoutModal(true);
    }
  }

  useEffect(() => {
    async function getCheckoutData(buyNow = false) {
      try {
        setFetchDataLoading(true);
        // const token = localStorage.getItem("token");
        const [addressData, cartData] = await axios.all([
          apiRequest({
            method: "get",
            url: `${import.meta.env.VITE_SERVER_URL}/user-address`,
          }),
          buyNow
            ? apiRequest({
                method: "get",
                url: `${import.meta.env.VITE_SERVER_URL}/products/${productId}`,
              })
            : apiRequest({
                method: "get",
                url: `${import.meta.env.VITE_SERVER_URL}/cart`,
              }),
        ]);
        if(!cartData?.data.length) {
          navigate('/');
          toast.error('Cart is empty!')
          return;
        }
        if(!addressData?.data?.addresses.length) {
          toast('Please add an address to continue', {
            style: { backgroundColor: '#fc9517' }
          });
          setShowAddressForm(true);
        }
        // console.log(addressData?.data, cartData?.data);
        setAddressList(addressData?.data.addresses);
        if (buyNow) {
          // console.log([{ product: cartData?.data, quantity: 1 }]);
          setCartItems([{ product: cartData?.data, quantity: 1 }]);
        } 
        else 
          setCartItems(cartData?.data);
        setSelectedAddressId(addressData?.data.addresses[0]._id);
      } catch (error) {
        console.log(error);
      } finally {
        setFetchDataLoading(false);
      }
    }

    if (authLoading === false) {
      if (currentUser?.name) {
        if (productId) 
          getCheckoutData(true);
        else getCheckoutData();

        setShowStripePaymentInfoModal("NOT_VIEWED");
      } else {
        navigate("/");
        toast.error("Login required");
        // setShowStripePaymentInfoModal('VIEWED');
      }
    }

    // if(currentUser.name) {
    //   if(productId)
    //     getCheckoutData(true);
    //   else
    //     getCheckoutData();
    // }

    window.scrollTo({ top: 0 });
  }, [authLoading, currentUser.name]);

  const editFormNameRef = useRef(null);
  const nameRef = useRef(null);
  useEffect(() => {
    if (nameRef.current) {
      nameRef.current.focus();
    }
  }, [showAddressForm]);

  return (
    currentUser?.name && (
      <>
        <div className="min-h-[calc(100vh-3.5rem)] flex flex-row justify-center bg-[#F1F3F6]">
          <div className="w-[57%] space-y-3 my-5">
            {/* Delivery Address Component */}
            {deliveryComponentActive ? (
              <div className="">
                <div className="border border-1">
                  <header className="flex flex-row gap-4 justify-start items-center bg-[#306cf0] pl-6 py-3 rounded-sm">
                    <span className="rounded-sm bg-white text-blue-500 text-xs px-2 py-[2px] font-medium flex flex-row justify-center items-center">
                      1
                    </span>
                    <h3 className="text-white font-semibold">
                      DELIVERY ADDRESS
                    </h3>
                  </header>

                  {fetchDataLoading ? (
                    <Loader style={{ marginTop: "100px" }} />
                  ) : (
                    addressList.map((address, index) =>
                      !address.editing ? (
                        <div
                          key={address._id}
                          onClick={() => handleSelectAddress(address._id)}
                          className={`flex flex-row items-start p-4 pl-7 ${
                            selectedAddressId === address._id
                              ? "bg-blue-50 cursor-default"
                              : "bg-white cursor-pointer"
                          } border-b last:shadow-[0_1px_0px_0px_rgba(0,0,0,0.1)] `}
                        >
                          <input
                            type="radio"
                            readOnly
                            name="selected-address"
                            checked={selectedAddressId === address._id}
                            className="mt-1"
                          />
                          <div className="flex flex-row justify-between w-full">
                            <div className=" flex flex-col items-start gap-2 pl-4">
                              <p className="flex flex-row items-center gap-3">
                                <span className="text-sm font-semibold">
                                  {address.name}
                                </span>
                                <span className="text-[10px] text-black/40 font-bold bg-black/5 px-2 py-1 rounded-sm">
                                  {address.addressType?.toUpperCase()}
                                </span>
                                <span className="text-sm font-semibold">
                                  {address.mobNum}
                                </span>
                              </p>
                              <p className="max-w-[40rem] text-start">
                                <span className="text-sm">{`${address.address}, ${address.locality}, ${address.city}, ${address.state} - `}</span>
                                <span className="text-sm font-medium">
                                  {address.pincode}
                                </span>
                              </p>
                              {selectedAddressId === address._id && (
                                <button
                                  onClick={() =>
                                    selectDeliveryAddress(address._id)
                                  }
                                  className="bg-[#FB641B] text-white text-sm py-[14px] px-14 font-semibold rounded-sm mt-1"
                                >
                                  DELIVER HERE
                                </button>
                              )}
                            </div>

                            {selectedAddressId === address._id && (
                              <div className="">
                                <button
                                  className="text-blue-600 text-sm font-semibold pr-2"
                                  onClick={(e) =>
                                    handleEditAddress(e, address._id)
                                  }
                                >
                                  EDIT
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="relative bg-blue-50 flex flex-col items-start px-14 py-4 gap-5">
                          <input
                            type="radio"
                            readOnly
                            checked={true}
                            name="newAddressForm"
                            className="absolute left-7 top-5"
                          />
                          <span className="text-blue-500 text-sm font-medium">
                            {" "}
                            EDIT ADDRESS
                          </span>
                          <form onSubmit={(e) => handleSubmitForEditAddress(e, address._id)} className="grid grid-cols-2 gap-4 w-3/4">
                            <div className="relative col-span-1">
                              <input
                                ref={nameRef}
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
                                className={`${
                                  addressAddUpdateLoading
                                    ? "outline outline-2 outline-[#FB641B]"
                                    : "bg-[#FB641B]"
                                } text-white text-sm py-[14px] w-[15.5rem] font-semibold rounded-sm`}
                              >
                                {!addressAddUpdateLoading ? (
                                  "SAVE AND DELIVER HERE"
                                ) : (
                                  <Loader
                                    width="20px"
                                    height="20px"
                                    borderWidth="3px"
                                  />
                                )}
                              </button>
                              {!addressAddUpdateLoading && (
                                <button
                                  type="button"
                                  className="text-blue-600 text-sm font-semibold"
                                  onClick={() =>
                                    handleCloseEditForm(address._id)
                                  }
                                >
                                  CANCEL
                                </button>
                              )}
                            </div>
                          </form>
                        </div>
                      )
                    )
                  )}
                  <div className="mt-2 shadow-[0_1px_0px_0px_rgba(0,0,0,0.1)]">
                    {!showAddressForm ? (
                      <button
                        onClick={handleShowAddressForm}
                        className="bg-white flex flex-row justify-start items-center gap-4 pl-7 py-2 text-blue-600 w-full "
                      >
                        <span className="text-2xl">+</span>
                        <span className="text-sm font-medium">
                          {addressList.length > 0
                            ? "Add a new address"
                            : "Add an address"}
                        </span>
                      </button>
                    ) : (
                      <div className="relative bg-blue-50 flex flex-col items-start px-14 py-4 gap-5">
                        <input
                          type="radio"
                          readOnly
                          checked={true}
                          name="newAddressForm"
                          className="absolute left-7 top-5 w-4 h-4"
                        />
                        <span className="text-blue-500 text-sm font-medium">
                          ADD A NEW ADDRESS
                        </span>
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
                              className={`${
                                addressAddUpdateLoading
                                  ? "outline outline-2 outline-[#FB641B]"
                                  : "bg-[#FB641B]"
                              } text-white text-sm py-[14px] w-[15.5rem] font-semibold rounded-sm`}
                            >
                              {!addressAddUpdateLoading ? (
                                "SAVE AND DELIVER HERE"
                              ) : (
                                <Loader
                                  width="20px"
                                  height="20px"
                                  borderWidth="3px"
                                />
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
                </div>
              </div>
            ) : (
              <div className="flex flex-row bg-white px-5 py-3 shadow">
                <span className="rounded-sm bg-[#ededed] text-blue-500 text-xs w-5 h-5 mt-1 font-medium flex flex-row justify-center items-center">
                  1
                </span>
                <div className="flex flex-row justify-between items-start w-full">
                  <div className="flex flex-col items-start gap-1 pl-4">
                    <h3 className="flex flex-row items-center gap-3">
                      <p className="text-black/50 font-semibold">
                        DELIVERY ADDRESS
                      </p>
                      <FaCheck className="text-blue-700" />
                    </h3>
                    <p className="max-w-[35rem] text-start">
                      <span className="text-sm font-medium">
                        {finalDeliveryAddress?.name + " "}
                      </span>
                      <span className="text-sm">{`${finalDeliveryAddress.address}, ${finalDeliveryAddress.locality}, ${finalDeliveryAddress.city}, ${finalDeliveryAddress.state} - `}</span>
                      <span className="text-sm font-medium">
                        {finalDeliveryAddress.pincode}
                      </span>
                    </p>
                  </div>
                  <button
                    onClick={handleOpenDeliveryComponent}
                    className="bg-white text-blue-500 text-sm font-semibold rounded-sm border border-1 mr-3 px-9 py-[10px]"
                  >
                    CHANGE
                  </button>
                </div>
              </div>
            )}

            {/* Order Summary Component */}
            {!deliveryComponentActive && finalDeliveryAddress ? (
              <div className="bg-white shadow">
                <header className="flex flex-row gap-4 justify-start items-center bg-[#306cf0] pl-6 py-3 rounded-sm">
                  <span className="rounded-sm bg-white text-blue-500 text-xs px-2 py-[2px] font-medium flex flex-row justify-center items-center">
                    2
                  </span>
                  <h3 className="text-white font-semibold">ORDER SUMMARY</h3>
                </header>
                <div className="flex flex-col">
                  {cartItems.length > 0 ? (
                    <>
                      {cartItems?.map((item, index) => (
                        <CartItem
                          key={index}
                          item={item}
                          checkoutUpdateQuantity={updateQuantity}
                          checkoutHandleDelete={handleDelete}
                          checkout={true}
                        />
                      ))}
                      <StripeCheckoutWrapper
                        products={cartItems}
                        shippingAddress={finalDeliveryAddress}
                      />
                    </>
                  ) : (
                    <div className="bg-yellow-50 text-start text-sm px-6 py-4">
                      Your checkout has no items.
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white flex flex-row justify-start items-center gap-4 pl-7 py-3 w-full mt-2 shadow-[0_1px_0px_0px_rgba(0,0,0,0.1)]">
                <span className="rounded-sm bg-[#ededed] text-blue-500 text-xs w-5 h-5 mt-1 font-medium flex flex-row justify-center items-center">
                  2
                </span>
                <h3 className="text-black/50 font-semibold">ORDER SUMMARY</h3>
              </div>
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="w-[25%] my-5 flex flex-col items-center gap-7 ">
              <div className="bg-white shadow divide-y-[1px] w-[90%]">
                <h2 className="text-black/50 text-sm font-bold pl-5 py-4">
                  PRICE DETAILS
                </h2>
                <div className="py-2">
                  <div className="flex flex-row justify-between items-center px-5 py-2">
                    <span>price ({cartItems.length} items)</span>
                    <span>₹{totalMrp}</span>
                  </div>
                  <div className="flex flex-row justify-between items-center px-5 py-2">
                    <span>Discount</span>
                    <span className="text-green-600">− ₹{totalDiscount}</span>
                  </div>
                  <div className="flex flex-row justify-between items-center px-5 py-2">
                    <span>Delivery Charges</span>
                    <span className="text-green-600">Free</span>
                  </div>
                </div>
                <div className="flex flex-row justify-between items-center px-5 py-4">
                  <span className="text-black font-semibold text-lg">
                    Total Amount
                  </span>
                  <span className="text-black font-semibold text-lg">
                    ₹{totalCost}
                  </span>
                </div>
                <p className="text-green-600 pl-5 py-3">
                  You will save ₹{totalDiscount} on this order
                </p>
              </div>
              <p className="text-center text-sm font-semibold text-black/50 w-[90%]">
                Safe and Secure Payments. Easy returns. 100% Authentic products.
              </p>
            </div>
          )}
        </div>
      </>
    )
  );
}

export default Checkout;
