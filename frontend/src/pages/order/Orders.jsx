import axios from "axios";
import {React, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";
import { BsBoxSeam } from "react-icons/bs";
import { CiDeliveryTruck } from "react-icons/ci";
import { FaRegCircleCheck } from "react-icons/fa6";
import { apiRequest } from "../../api/api";

function Orders() {

  const { currentUser, loading: authLoading } = useSelector(state => state.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    async function getOrders() {
      try {
        setLoading(true)
        const res = await apiRequest({
          method: 'get',
          url: `${import.meta.env.VITE_SERVER_URL}/orders`, 
          });

        setOrders(res?.data.orders)
      } catch (error) {
          console.log(error);
      } finally {
          setLoading(false);
      }
    }

    if (authLoading === false) {
      if (currentUser?.name) {
        getOrders();
      } 
      else 
        navigate("/");
    }
  
  }, [authLoading, currentUser?.name])

  const ImageStack = ({ images, maxImages = 2 }) => {
    const visibleImages = images.slice(0, maxImages);
    const remainingImages = images.length - maxImages;
  
    return (
      loading 
      ? <Loader width='50px' height='50px' style={{ marginTop: "240px" }} /> 
        :
      <div className="flex">
        {visibleImages.map((img, index) => (
          <div
            key={index}
            className="w-[72px] h-[72px] rounded-2xl border-[1px] border-black/20 overflow-hidden"
            style={{ zIndex: visibleImages.length - index, marginLeft: index !== 0 ? "-20px" : "0" }}
          >
            <img src={img} alt="" className="w-full h-full object-cover" />
          </div>
        ))}
        {remainingImages > 0 && (
          <div
            className="w-[72px] h-[72px] rounded-2xl bg-gray-200 border-[1px] border-black/20 flex items-center text-sm font-semibold text-gray-700"
            style={{ zIndex: 0, marginLeft: "-36px"}}
          >
           <span className="pl-10"> +{remainingImages}</span>
          </div>
        )}
      </div>
    );
  };

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
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Loader width='50px' height='50px' style={{ marginTop: "240px" }} />
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 ml-2">My Orders ({orders?.length})</h1>
        </div>

        <div className="space-y-2">
          {orders.length > 0 ? (
            orders.map(order => (
              <div 
                key={order._id} 
                onClick={() => navigate(`/order?orderId=${order?._id}`)} 
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer border border-gray-100"
              >
                <div className="p-6">
                  {/* Order Header */}
                  <div className="flex justify-between items-start mb-4 pb-4 border-b">
                    {order.paymentStatus === 'unpaid' 
                    ? <div className="flex items-center space-x-2">
                        <span className="text-sm text-red-500">Order Not placed</span>
                        <span className="text-sm font-medium">{formatDate(order.createdAt)}</span>
                      </div>
                    : <div className="flex items-center space-x-2">
                        <BsBoxSeam className="w-5 h-5 text-blue-600" />
                        <span className="text-sm text-gray-600">Order placed:</span>
                        <span className="text-sm font-medium">{formatDate(order.createdAt)}</span>
                    </div>}
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-900">₹{order.totalAmount}</span>
                      <span className="mx-2 text-gray-300">|</span>
                      <span className="text-sm text-gray-600">{order.paymentMethod.toUpperCase()}</span>
                    </div>
                  </div>

                  {/* Order Content */}
                  <div className="flex items-start space-x-4">

                    {/* Product Images */}
                    <div className="flex-shrink-0 min-w-40">
                      {order.items?.length === 1 ? (
                        <img 
                          src={order.items[0].product.url} 
                          alt="" 
                          className="w-24 h-24 object-contain rounded-lg border border-gray-100" 
                        />
                      ) : (
                        <ImageStack images={order.items.map(item => item.product.url)} />
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="w-[65%]">
                      <div className="space-y-1">
                        {order.items?.slice(0, 2).map((item, index) => (
                          <p key={index} className="text-sm text-gray-800">{item.product.name}</p>
                        ))}
                        {order.items?.length > 2 && (
                          <p className="text-sm text-gray-500">+{order.items?.length-2} more items</p>
                        )}
                      </div>
                    </div>

                    {/* Order Status */}
                    {order.paymentStatus === 'paid' && 
                    <div className="flex-shrink-0 flex justify-end w-[18%]">
                      {order.orderStatus === 'pending' ? (
                        <div className="flex flex-col items-end ">
                          <div className="flex items-center space-x-2 text-amber-600">
                            <CiDeliveryTruck  className="w-4 h-4" />
                            <span className="text-sm font-medium">On the way</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            Arriving by {getDeliveryDate("pending")}
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-end">
                          <div className="flex items-center space-x-2 text-green-600">
                            <FaRegCircleCheck className="w-4 h-4" />
                            <span className="text-sm font-medium">Delivered</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            On {getDeliveryDate('delivered')}
                          </p>
                        </div>
                      )}
                    </div>}

                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <BsBoxSeam className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
              <p className="text-gray-600">When you place orders, they will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 

export default Orders;