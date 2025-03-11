import React, { useState } from 'react'
import flipkartAssuredImg from '../../images/flipkart-assured.png'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { deleteCartItemAsync, updateCartItemQuantityAsync } from '../../reducers/cart/cartSlice'
import Loader from '../../components/Loader'

const CartItem = ({ item, checkoutUpdateQuantity, checkoutHandleDelete, checkout=false }) => {

  const { product, quantity } = item;

  const [deleteLoading, setDeleteLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  
  const dispatch = useDispatch();

  async function updateQuantity(id, quantity) {
    if(checkout) {
      checkoutUpdateQuantity(id, quantity);
    }
    else {
      setUpdateLoading(true);
      dispatch(updateCartItemQuantityAsync({ productId: id, newQuantity: quantity }));
      setUpdateLoading(false);
    }
  }

  async function handleDeleteProduct(product) {
    if(checkout) {
      checkoutHandleDelete(product);
    } 
    else {
      setDeleteLoading(true);
      await dispatch(deleteCartItemAsync({ product: product, fromCartPage: true })).unwrap();
      setDeleteLoading(false);
    }
  }

  return (
    <div className={`flex flex-col gap-6 p-5 bg-white shadow-md rounded-lg`}>
      <div className='flex flex-row items-center gap-6'>
        <Link to={`/Products/${product?._id}`} className='flex-shrink-0'>
          <div className='h-[17vh] w-[17vh]'>
            <img src={product?.url} alt={`${product?.name}`} className='h-full w-full object-contain' />
          </div>
        </Link>
        <div className='flex flex-col justify-between'>
          <Link to={`/Products/${product?._id}`}>
            <h3 className='text-black hover:text-blue-500 text-start'>{product?.name}</h3>
          </Link>
          <span className='h-8 mt-2'>
            <img src={flipkartAssuredImg} alt="Flipkart Assured" width='64px' />
          </span>
          <span className='flex flex-row items-center gap-3 mt-2'>
            {product?.originalprice > product?.price && <h3 className={`line-through text-black/50 text-sm`}>₹{product?.originalprice}</h3>}
            <h1 className='font-semibold'>₹{product?.price}</h1>
            <h3 className='text-green-600 text-sm'>{product?.discount === "0" ? "" : product?.discount}</h3>
          </span>
        </div>
      </div>
      <div className='flex flex-row items-center'>
        <div className="flex flex-row gap-1 h-8 w-28 rounded-lg bg-transparent">
          <button disabled={quantity <= 1 || updateLoading} onClick={() => updateQuantity(product?._id, quantity-1)} className={`border-[1px] bg-gray-50 ${quantity > 1 && 'hover:bg-gray-200'} border-gray-400 h-full w-[30%] rounded-l-lg flex items-center justify-center ${quantity <= 1 ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'}`}>
            <span className="">−</span>
          </button>
          <div className="border-[1px] border-gray-400 text-center text-sm w-[40%] h-full font-semibold flex items-center justify-center">
            {quantity}
          </div>
          <button disabled={updateLoading} onClick={() => updateQuantity(product?._id, quantity+1)} className="border-[1px] bg-gray-50 hover:bg-gray-200 border-gray-400 h-full w-[30%] rounded-r-lg cursor-pointer flex items-center justify-center">
            <span className="">+</span>
          </button>
        </div>
        <button disabled={deleteLoading} onClick={() => handleDeleteProduct(product)} className={`w-24 h-8 ml-4 py-1 border-[1px] border-red-500 text-black rounded-lg ${!deleteLoading && 'hover:bg-red-500'} hover:text-white`}>
          {deleteLoading ? <Loader width='15px' height='15px' borderWidth='2px' /> : 'Remove'}
        </button>
      </div>
    </div>
  )
}

export default CartItem