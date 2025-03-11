import React, { useEffect, useState } from "react";
import {
  getWishlistItemsAsync,
  deleteWishlistItemAsync,
} from "../reducers/wishlist/wishlistSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import flipkartAssuredImg from "../images/flipkart-assured.png";
import { RiStarFill } from "react-icons/ri";
import { MdDelete } from "react-icons/md";
import Loader from "../components/Loader";
import toast from "react-hot-toast";

const Wishlist = () => {

  const { currentUser, loading: authLoading } = useSelector((state) => state.auth);
  const { wishlistItems, loading } = useSelector((state) => state.wishlist);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function handleDelete(e, item) {
    e.stopPropagation();
    e.preventDefault();

    dispatch(deleteWishlistItemAsync({ product: item, fromWishlistPage: true }));
  }

  useEffect(() => {
    if (authLoading === false) {
      if (currentUser?.name) {
        dispatch(getWishlistItemsAsync());
      } 
      else {
        navigate("/");
        // toast.error('Login required');
      }
    }
  }, [authLoading, currentUser?.name]);

  if (loading && authLoading) {
    return <Loader width="50px" height="50px" style={{ marginTop: "240px" }} />;
  }

  return (
    currentUser?.name && 
    <div className="min-h-[calc(100vh-4rem)] bg-[#F1F3F6]">
      <div className="w-[60%] flex flex-col items-center mx-auto">
        <div className="w-full text-black font-semibold pl-7 py-4 border-b-[1px] border-b-black/10 bg-white mt-4">
          My Wishlist ({wishlistItems?.length})
        </div>
        {wishlistItems?.length > 0 ? (
          <div className="w-full flex flex-col divide-y-[1px] mb-4">
            {wishlistItems?.map((item, index) => (
              <div key={item._id} className="relative">
                <Link
                  to={`/Products/${item._id}`}
                  className="flex flex-row gap-6 bg-white group py-5 px-7"
                >
                  <div className="h-[20vh] p-2">
                    <img
                      src={item.url}
                      alt={`${item.name}`}
                      width={100}
                      className="h-full object-contain"
                    />
                  </div>
                  <div className="flex flex-col items-start w-[75%]">
                    <h3 className="text-black group-hover:text-blue-500 truncate">
                      {item?.name}
                    </h3>
                    <span className="flex flex-row items-center gap-5">
                      <span className="flex flex-row h-5 rounded-[4px] justify-center items-center gap-[2px] bg-green-600 text-white text-xs px-[5px]">
                        4<RiStarFill />
                      </span>
                      <img src={flipkartAssuredImg} alt="" width="78px" />
                    </span>
                    <span className="flex flex-row items-center gap-2 mt-6">
                      <h1 className="font-semibolds text-lg font-medium">₹{item?.price}</h1>
                      {item?.originalprice > item?.price && <h3 className="line-through text-black/50 text-md">
                        ₹{item?.originalprice}
                      </h3>}
                      <h3 className="text-green-600 text-sm font-semibold">
                        {item?.discount}
                      </h3>
                    </span>
                  </div>
                </Link>
                <span
                  onClick={(e) => handleDelete(e, item)}
                  className="absolute top-2 right-4 p-2 text-xl text-black/30 hover:text-blue-500 cursor-pointer"
                >
                  <MdDelete />
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full flex flex-col items-center justify-center py-8 bg-white rounded-md shadow mb-4">
            <p className="text-gray-500 text-lg font-medium mb-2">
              Your wishlist is empty
            </p>
            <p className="text-gray-400 text-sm">
              Add items to your wishlist to see them here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
