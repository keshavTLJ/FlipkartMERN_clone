import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { addCartItemAsync } from '../reducers/cart/cartSlice';
import { addWishlistItemAsync, deleteWishlistItemAsync, deleteWishlistItemFromRedux } from '../reducers/wishlist/wishlistSlice';
import {IoMdFlash} from 'react-icons/io'
import {FaTag} from 'react-icons/fa'
import {RiStarFill} from 'react-icons/ri'
import {AiFillHeart} from 'react-icons/ai'
import flipkartAssuredImg from '../images/flipkart-assured.png'
import axios from 'axios';
import Loader from '../components/Loader';
import { apiRequest } from '../api/api';
import { useModal } from '../context/ModalContext';
// import { womenData } from '../products/womenProducts';
// import { menData } from '../products/menProducts';
// import { products } from '../products/products';

const ProductDetails = () => {

    const { setLoginModal } = useModal();

    const currentUser = useSelector(state => state.auth.currentUser)
    const { wishlistProductIds, loading: wishlistLoading } = useSelector(state => state.wishlist);
    const { cartProductIds, loading: cartLoading } = useSelector(state => state.cart)
    
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(false);
    
    const { id } = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    function addToWishlist() {
        currentUser.name ? 
            dispatch(addWishlistItemAsync(product))
            : setLoginModal(true);   
    }
    
    function handleClick() {
        if(wishlistLoading) {
            return;
        }
        if(presentInWishlist) {
            dispatch(deleteWishlistItemAsync({ product: product, fromWishlistPage: false }));
        }
        else {
            addToWishlist()
        }
    }

    function handleAddToCart() {
        currentUser?.name ? 
            dispatch(addCartItemAsync(product)) 
            : setLoginModal(true);
    }

    function handleBuyNow() {
        currentUser?.name ? 
            navigate(`/checkout?productId=${product._id}`) 
                : setLoginModal(true);
    }

    useEffect(() => {
        (async function() {
          setLoading(true);
          try {
              const url = `${import.meta.env.VITE_SERVER_URL}/products/` + id;
              const res = await apiRequest({ method: 'get', url: url }, false);
              setProduct(res?.data);
          } catch (error) {
              console.log(error);
              toast.error("Error fetching data!")
          } finally {
            setLoading(false);
          }
        })()
      }, [id])
    
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])
    
    const presentInWishlist = (currentUser.name && wishlistProductIds?.length > 0) &&  
                                                wishlistProductIds.some(id => product?._id === id);

    const presentInCart = (currentUser.name && cartProductIds?.length > 0) && 
                                                cartProductIds.some(id => product?._id === id);

    if(loading)
        return <Loader size='50px' style={{ marginTop: "240px" }} />
        
  return (
    <div className='bg-gray-200'>
        <div className='h-[calc(100vh-3.5rem)] bg-white flex flex-row px-4 pt-3 mx-20'>
        
            <div className='flex flex-col'>
                <div className='relative border w-[24vw] h-[calc(100%-10rem)] p-4'>
                    <img src={product?.url} alt="" className='w-full h-full object-contain' />
                    <span onClick={handleClick} className='absolute right-4 top-2 h-9 w-9 rounded-full shadow flex flex-row justify-center items-center cursor-pointer'>
                        {wishlistLoading ? 
                            <Loader size='16px' borderWidth='3px' />
                            : 
                            <AiFillHeart className={`${presentInWishlist ? 'text-red-400' : 'text-black/20'} text-2xl hover:text-red-400`} />
                        }
                    </span>
                </div>
                <div className='flex flex-row mt-2 gap-2 justify-center'>
                    {!presentInCart ?
                    (<button onClick={handleAddToCart} className={` ${cartLoading ? 'bg-[#f6c36b]' : 'bg-[#FFAC1C]'} text-white flex flex-row gap-2 w-1/2 h-[52px] items-center justify-center rounded-sm font-semibold transition-all duration-300 hover:shadow-lg`}>
                        <span>
                            <svg className="" width="18" height="18" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                              <path
                                className=""
                                d="M15.32 2.405H4.887C3 2.405 2.46.805 2.46.805L2.257.21C2.208.085 2.083 0 1.946 0H.336C.1 0-.064.24.024.46l.644 1.945L3.11 9.767c.047.137.175.23.32.23h8.418l-.493 1.958H3.768l.002.003c-.017 0-.033-.003-.05-.003-1.06 0-1.92.86-1.92 1.92s.86 1.92 1.92 1.92c.99 0 1.805-.75 1.91-1.712l5.55.076c.12.922.91 1.636 1.867 1.636 1.04 0 1.885-.844 1.885-1.885 0-.866-.584-1.593-1.38-1.814l2.423-8.832c.12-.433-.206-.86-.655-.86"
                                fill="#fff">
                              </path>
                            </svg>
                        </span>
                        {cartLoading ? <Loader size='20px' borderWidth = "3px" /> : 'ADD TO CART'}</button>)
                        :
                        <Link to='/cart' className='text-[#eda831] text-lg outline outline-[2px] outline-[#eda831] flex flex-row gap-2 w-1/2 h-[52px] items-center justify-center rounded-sm font-semibold transition-all duration-300 hover:shadow-lg'>Go To Cart</Link>
                    }
                    <button onClick={handleBuyNow} className='bg-[#FF7518] text-white w-1/2 text-center rounded-sm font-semibold flex flex-row justify-center items-center gap-1'><IoMdFlash size='1.2rem' />BUY NOW</button>
                </div>
            </div>

            <div className='flex flex-col px-10 py-2'>
                <span className='text-start text-black/50 text-sm font-semibold'>{product?.brand}</span>
                <div className="flex">
                    <h3 className='text-xl'>{product?.name}</h3>
                </div>
                <span className='flex flex-row gap-3 mt-1'>
                    <span className='flex flex-row h-5 rounded justify-center items-center bg-green-600 text-white text-xs px-1'>4<RiStarFill className='' /></span>
                    <p className='text-black/50 text-sm font-semibold'>1,632 Ratings & 255 Reviews</p>
                    <span className='h-8'><img src={flipkartAssuredImg} alt="" width='72px' className='mt-[2px]' /></span>
                </span>
                <div className='flex flex-col items-start mt-2'>
                    <p className='text-green-600 text-sm font-semibold'>{`Extra ₹${product?.originalprice-product?.price} off`}</p>
                    <span className='flex flex-row items-center gap-3'>
                        <h1 className='text-2xl '>₹{product?.price}</h1>
                        <h3 className='line-through text-black/50 '>₹{product?.originalprice}</h3>
                        <h3 className='text-green-600 font-semibold'>{product?.discount  !== "NaN" && product?.discount }</h3>
                    </span>
                </div>
                <div className='flex flex-col items-start gap-3 mt-4'>
                    <span className='font-semibold'>Available offers</span>
                    <div className='flex flex-row items-center gap-2 text-sm'>
                        <FaTag className='text-green-500' />
                        <p><span className='font-semibold'>Bank Offer</span> 10% off on Bank of Baroda Credit Card EMI Transactions, up to ₹1,000 on orders of ₹5,000 and above <span className='text-blue-600 cursor-pointer'>T&C</span></p>
                    </div>
                    <div className='flex flex-row items-center gap-2 text-sm'>
                        <FaTag className='text-green-500' />
                        <p><span className='font-semibold'>Bank Offer</span> 10% off on IDFC FIRST Bank Credit Card EMI Transactions, up to ₹1,000 on orders of ₹5,000 and above <span className='text-blue-600 cursor-pointer'>T&C</span></p>
                    </div>
                    <div className='flex flex-row items-center gap-2 text-sm'>
                        <FaTag className='text-green-500' />
                        <p><span className='font-semibold'>Bank Offer</span> 10% off on IndusInd Bank Credit Card EMI Transactions, up to ₹1,000 on orders of ₹7,500 and above<span className='text-blue-600 cursor-pointer'>T&C</span></p>
                    </div>
                    <div className='flex flex-row items-center gap-2 text-sm'>
                        <FaTag className='text-green-500' />
                        <p><span className='font-semibold'>Special Price</span> Get extra ₹3000 off (price inclusive of cashback/coupon)<span className='text-blue-600 cursor-pointer'> T&C</span></p>
                    </div>
                </div>
            </div>
            
        </div>
    </div>
  )
}

export default ProductDetails