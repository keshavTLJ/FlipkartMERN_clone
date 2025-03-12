import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteWishlistItemFromRedux,
  deleteWishlistItemAsync,
  addWishlistItemAsync,
} from "../reducers/wishlist/wishlistSlice";
import flipkartAssuredImg from "../images/flipkart-assured.png";
import { AiFillHeart } from "react-icons/ai";
import axios from "axios";
import Loader from "../components/Loader";
import { apiRequest } from "../api/api";
import { useModal } from "../context/ModalContext";
// import { menData } from '../products/menProducts';

const Fashion = () => {
    
  const { setLoginModal } = useModal();
  
  const currentUser = useSelector(state=> state.auth.currentUser);
  const wishlistProductIds = useSelector(state => state.wishlist.wishlistProductIds);
  
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const location  = useLocation()
  const { category } = useParams();
  const dispatch = useDispatch();
  
  const sortby = searchParams.get('sortby') || 'popularity';
  const order = searchParams.get('order') || '1';
  const page = searchParams.get('page') || '1';

  function handleSortChange(newSortby, newOrder) {
    setSearchParams({ sortby: newSortby,  order: newOrder, page: '1' })
  }

  function handlePageChange(newPage) {
    setSearchParams({ sortby, order, page: String(newPage) })
  }


  function presentInWishlist(productId) {
    if (currentUser.name && wishlistProductIds.length > 0) 
      return wishlistProductIds.some(id => productId === id);

    return false;
  }

  function addToWishlist(e, product) {
    e.preventDefault();
    e.stopPropagation();

    if (currentUser.name) {
      if (!presentInWishlist(product._id)) {
        dispatch(addWishlistItemAsync(product));
      } else {
        dispatch(deleteWishlistItemAsync({ product: product, fromWishlistPage: false }));
      }
    } else {
      setLoginModal(true);
    }
  }

  useEffect(() => {
    async function getProducts() {
      try {
        setLoading(true);
        let url;
        if(location.pathname.slice(1).split('/')[0] === 'fashion' && !category)
          url = `${import.meta.env.VITE_SERVER_URL}/fashion?sortby=${sortby}&order=${order}&page=${page}`;
        else
          url = `${import.meta.env.VITE_SERVER_URL}/fashion/${category}?sortby=${sortby}&order=${order}&page=${page}`;

        const res = await apiRequest({
          method: 'get',
          url: url
        }, false);
      
        window.scrollTo({ top: 0, behavior: 'smooth' })
        // console.log(res?.data);
        setProductData(res?.data);
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false);
      }
    }

    getProducts();
  }, [page, sortby, order]);

  if(loading) {
    return <Loader size='50px' borderWidth='4px' style={{ marginTop: "240px" }} />
  }

  return (
    <div className="bg-[#F2F2F2] flex flex-row gap-2 py-2 px-2">
      <div id="filter-section" className="w-[23%] bg-white"></div>
      <div id="product-section" className="bg-white w-full">
        <div className="h-16 border-b-[1px] pl-4 py-2 flex flex-col gap-2">
          <div className="flex flex-row items-center gap-2">
            <p className="font-semibold">Men's Clothing</p>
            <p className="text-xs text-black/60 mt-[2px] font-semibold">
              {productData?.products.length > 0
                ? `(Showing ${(productData?.currentPage - 1) * 40 + 1} – ${
                    (productData?.currentPage - 1) * 40 +
                    productData?.products?.length
                  } products of ${productData?.totalProductsCount} products)`
                : `No results for ${category}`}
            </p>
          </div>
          <div className="flex flex-row items-center gap-4 text-sm">
            <span className="font-semibold">Sort By</span>
            <button
              disabled={sortby === "popularity"}
              onClick={() => handleSortChange('popularity', '1')}
              className={`${sortby === 'popularity' ? "text-blue-500 font-semibold" : "text-black"}`}
            >
              Popularity
            </button>
            <button
              disabled={sortby === 'price' && order === '1'}
              onClick={() => handleSortChange('price', '1')}
              className={`${sortby === 'price' && order === '1' ? "text-blue-500 font-semibold" : "text-black"}`}
            >
              Price -- Low to High
            </button>
            <button
              disabled={sortby === 'price' && order === '-1'}
              onClick={() => handleSortChange('price', '-1')}
              className={`${sortby === 'price' && order === '-1' ? "text-blue-500 font-semibold" : "text-black"}`}
            >
              Price -- High to Low
            </button>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2 items-start">
          {productData?.products?.length > 0 &&
            productData?.products?.map((product, index) => (
              <Link
                to={`/products/${product._id}`}
                key={product?._id}
                className="relative flex flex-col hover:shadow-md transition-all"
              >
                <div className="p-2 flex justify-center">
                  <img
                    src={product?.url}
                    alt={product?.name}
                    className="h-56 object-contain hover:scale-105 transition-all"
                  />
                </div>
                <AiFillHeart onClick={(e) => addToWishlist(e, product)} className={`absolute top-2 right-2 text-3xl hover:text-red-400 ${presentInWishlist(product._id) ? 'text-red-400' : 'text-black/20'}`} />
                <div className="flex flex-col h-1/5 px-4 py-2">
                  <h3 className="text-black/50 text-sm font-medium">
                    {product?.brand}
                  </h3>
                  <div className="flex flex-row items-center gap-2">
                    <p className="text-sm truncate">{product.name}</p>
                    <img src={flipkartAssuredImg} alt="" width="64px" />
                  </div>
                  <div className="flex flex-row items-center gap-2 mt-2">
                    <h1 className="font-semibold">₹{product?.price}</h1>
                    <h3 className="line-through text-black/50 text-sm">
                      ₹{product?.originalprice}
                    </h3>
                    <h3 className="text-green-600 text-xs font-semibold">
                      {product?.discount}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
        </div>
        {productData?.products?.length > 0 && (
          <div className="flex flex-row items-center py-4 px-2">
            <p className="text-sm">
              Page {productData?.currentPage} of {productData?.pages.length}
            </p>
            <div className="flex flex-row items-center gap-6 mx-auto">
              {productData?.currentPage > 1 && (
                <button
                  onClick={() => handlePageChange(parseInt(page) - 1)}
                  className="text-blue-500 text-sm font-semibold"
                >
                  PREVIOUS
                </button>
              )}
              <div className="flex flex-row items-center gap-3">
                {productData?.pages?.map((pageNumber, index) => (
                  <div
                    key={index}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`flex flex-row justify-center items-center w-8 h-8 rounded-full ${
                      page == pageNumber
                        ? "bg-blue-500"
                        : "bg-white"
                    }`}
                  >
                    <button
                      className={`text-black text-sm font-semibold ${
                        productData?.currentPage == pageNumber
                          ? "text-white"
                          : "text-black"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  </div>
                ))}
              </div>
              {productData?.currentPage < productData?.pages?.length && (
                <button
                  onClick={() => handlePageChange(parseInt(page) + 1)}
                  className="text-blue-500 text-sm font-semibold"
                >
                  NEXT
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Fashion;
