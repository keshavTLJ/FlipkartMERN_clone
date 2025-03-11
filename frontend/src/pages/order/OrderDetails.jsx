import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { removeUser } from '../../reducers/auth/authSlice';
import { FaRegCircleCheck } from "react-icons/fa6";
import { MdOutlineCancel } from "react-icons/md";
import { FiCreditCard } from "react-icons/fi";
import { PiMapPin } from "react-icons/pi";
import { BsBoxSeam } from "react-icons/bs";
import Loader from '../../components/Loader';

function OrderDetails() {

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const currentUser = useSelector((state) => state.auth.currentUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const orderId = searchParams.get('orderId')
  // console.log(orderId)

  useEffect(() => {
    async function getOrderDetails() {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const url = `${import.meta.env.VITE_SERVER_URL}/order?orderId=` + orderId;
        const res = await axios.get(url, { 
          headers: { Authorization : `Bearer ${token}`} 
        });
        setOrder(res?.data.order);
      } catch (error) {
        console.log(error);
        if(error?.status === 401 && error?.response?.data.error === 'Request Unauthorized') {
          dispatch(removeUser());
          navigate('/');
        }
      } finally {
        setLoading(false);
      }
    }

    if(currentUser?.name && orderId)
      getOrderDetails();

  }, [currentUser, orderId]);

  const getDeliveryDate = (type) => {
    const today = new Date();
    const deliveryDate = new Date(today);
    type === 'pending' && deliveryDate.setDate(today.getDate() + 2)
    type === 'delivered' && deliveryDate.setDate(today.getDate() - 2)

    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return deliveryDate.toLocaleDateString('en-US', options);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Loader width='50px' height='50px' style={{ marginTop: "240px" }} />
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">Order Details</h1>
            <span className="text-sm text-gray-500">Order placed: {formatDate(order?.createdAt)}</span>
          </div>

          {/* Order Status */}
          <div className="flex items-center mb-8">
            {order?.paymentStatus === 'paid' ? 
              <>
                <FaRegCircleCheck className={`w-6 h-6 ${order?.orderStatus === 'delivered' ? 'text-green-500' : 'text-yellow-500'} mr-2`} />
                <span className={`${order?.orderStatus === 'delivered' ? 'text-green-500' : 'text-yellow-500'} font-medium`}>
                  Order {order?.orderStatus}
                </span>
              </> 
              :
              <>
                <MdOutlineCancel className="w-7 h-7 text-red-500 mr-2" />
                <span className="text-red-500 font-medium">Order not placed</span>
              </>
            }
            <span className="mx-4 text-gray-300">|</span>
            <FiCreditCard className={`w-6 h-6 ${order?.paymentStatus === 'paid' ? 'text-blue-500' : 'text-red-500'} mr-2`} />
            <span className={`${order?.paymentStatus === 'paid' ? 'text-blue-500' : 'text-red-500'} font-medium" `}>
              Payment {order?.paymentStatus === 'paid' ? 'paid' : 'cancelled'}
            </span>
            {order?.paymentStatus === 'paid' && 
            <>
              <span className="mx-4 text-gray-300">|</span>
              <span className='text-gray-600'>
                {order?.orderStatus === 'pending' ? 'Arriving by' : 'Delivered on'} {getDeliveryDate(order?.orderStatus)}
              </span>
            </>
            }
          </div>
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Order Items - Takes up 2 columns */}
            <div className="md:col-span-2">
              <div className="border rounded-lg">
                {order?.items.map((item, index) => (
                  <div onClick={() => navigate(`/products/${item.product._id}`)} key={index} className="flex items-start p-4 border-b last:border-b-0 cursor-pointer">
                    <img 
                      src={item.product.url} 
                      alt={item.product.name}
                      className="w-24 h-24 object-contain rounded"
                    />
                    <div className="flex flex-col items-start ml-4 flex-grow">
                      <h3 className="text-lg text-start font-medium text-gray-800">{item.product.name}</h3>
                      <div className="mt-2 flex items-center">
                        <span className="text-lg font-semibold">₹{item.product.price}</span>
                        <span className="ml-2 text-sm text-gray-500 line-through">₹{item.product.originalprice}</span>
                        <span className="ml-2 text-sm text-green-500">
                          {Math.round((1 - item.product.price / item.product.originalprice) * 100)}% off
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Quantity: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side Column - Takes up 1 column */}
            <div className="md:col-span-1 space-y-6">
              {/* Delivery Address */}
              <div className="border rounded-lg p-4 flex flex-col items-start">
                <div className="flex items-center mb-4">
                  <PiMapPin className="w-5 h-5 text-gray-600 mr-2" />
                  <h2 className="text-lg font-medium">Delivery Address</h2>
                </div>
                <div className="text-gray-600 flex flex-col items-start">
                  <p className="font-medium">{order?.shippingAddress.name}</p>
                  <p>{order?.shippingAddress.address}</p>
                  <p>{order?.shippingAddress.locality}</p>
                  <p>{order?.shippingAddress.city}, {order?.shippingAddress.state} - {order?.shippingAddress.pincode}</p>
                  <p className="mt-2"><span className='font-medium'>Phone:</span> {order?.shippingAddress.mobNum}</p>
                </div>
              </div>

              {/* Price Details */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center mb-4">
                  <BsBoxSeam className="w-5 h-5 text-gray-600 mr-2" />
                  <h2 className="text-lg font-medium">Price Details</h2>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Price ({order?.items.length} items)</span>
                    <span>₹{order?.totalAmount}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Charges</span>
                    <span className="text-green-500">FREE</span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-medium text-lg">
                      <span>Total Amount</span>
                      <span>₹{order?.totalAmount}</span>
                    </div>
                  </div>
                  <div className="text-green-500 text-sm mt-2 text-left">
                    Your Total Savings: ₹{order?.items.reduce((acc, item) => 
                      acc + (item.product.originalprice - item.product.price), 0
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetails