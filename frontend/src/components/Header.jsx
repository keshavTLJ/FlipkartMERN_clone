import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { RiShutDownLine } from 'react-icons/ri'
import { AiFillHeart } from 'react-icons/ai'
import { CgProfile } from "react-icons/cg";
import { BsBoxSeam } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { removeUser } from "../reducers/auth/authSlice";
import { resetWishlist } from "../reducers/wishlist/wishlistSlice";
import { resetCart } from "../reducers/cart/cartSlice";
import { apiRequest } from "../api/api";
import { useModal } from "../context/ModalContext";

const Header = () => {
  const logoURL = "https://static-assets-web.flixcart.com/www/linchpin/fk-cp-zion/img/flipkart-plus_8d85f4.png";
  const subURL = "https://static-assets-web.flixcart.com/www/linchpin/fk-cp-zion/img/plus_aef861.png";

  const { setLoginModal } = useModal();

  const { currentUser } = useSelector(state => state.auth);
  const wishlistLength = useSelector(state => state.wishlist?.wishlistProductIds?.length);
  const cartLength = useSelector(state => state.cart?.cartProductIds?.length);

  const [input, setInput] = useState("");
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const inputRef = useRef();
  const location  = useLocation();
  const [activeIndex, setActiveIndex] = useState(-1);
  const navigate  = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();

  const query = searchParams.get('q');
  
  // GET suggested products on input change
  const getSuggestedProducts = async (value, signal) => {
    
    // const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/suggest`, { query: trimmedValue });
    try {
      const data = { query: value };
      const res = await apiRequest({ 
      method: 'post', 
      url: '/suggest', 
      data,
      signal
    }, false);
    // console.log(res?.data);
    setSuggestedProducts(res?.data)
    } catch (error) {
      console.log(error);
    } finally {
      // setLoading(false);
    }
  }

  function debounce(func, delay) {
    let timeoutId;
    let abortController;

    const debouncedFunction = function (...args) {
      clearTimeout(timeoutId);

      if(abortController)
        abortController.abort();

      abortController = new AbortController();

      timeoutId = setTimeout(() => {
        func(...args, abortController.signal);
      }, delay);
    };

    // cancel method to the debounced function
    debouncedFunction.cancel = () => {
      clearTimeout(timeoutId);
      if(abortController)
        abortController.abort();
    };

    return debouncedFunction;
  }

  const debouncedSuggest = useCallback(
    debounce(getSuggestedProducts, 150),
  []);

  const handleChange = (e) => {
    const value = e.target.value;
    setInput(value);

    const trimmedValue = value.trim().toLowerCase();
    if (trimmedValue === "") {
      debouncedSuggest.cancel();
      setSuggestedProducts([]);
    } else {
      debouncedSuggest(trimmedValue);
    }
  };

  const handleFocus = (e) => {
    const value = e.target.value;
    setInput(value);

    const trimmedValue = value.trim().toLowerCase();
    if(trimmedValue !== "") {
      debouncedSuggest(trimmedValue);
    }
    else
      setSuggestedProducts([]);
  };

  // Navigating to searchResults page on ENTER or SEARCH button click
  const searchQueryHandler = (e) => {
    // console.log(e)
    if((e?.key === "Enter" || e === "searchButton") && input?.trim() !== "" && input !== decodeURIComponent(query))
      {
        debouncedSuggest.cancel();
        navigate(`/search?q=${encodeURIComponent(input)}&sortby=popularity&order=1&page=1`);
        inputRef.current.blur();
      }
      else
        return;
  }

  // To navigate the suggested products using arrow keys
  const handleKeyDown = (e) => {
    // console.log(e.key)
    if (!suggestedProducts.length) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault(); // Prevent cursor from moving in input
        setActiveIndex(activeIndex => {
          const newIndex = activeIndex < suggestedProducts.length-1 ? activeIndex+1 : 0;
          setInput(suggestedProducts[newIndex].name);
          return newIndex;
        });
        break;

      case 'ArrowUp':
        e.preventDefault(); // Prevent cursor from moving in input
        setActiveIndex(activeIndex => {
          const newIndex = activeIndex > 0 ? activeIndex-1 : suggestedProducts.length-1;
          setInput(suggestedProducts[newIndex].name);
          return newIndex;
        });
        break;

      // case 'Enter':
      //   if (activeIndex >= 0) {
      //     e.preventDefault();
      //     // window.location.href = `/products/${suggestedProducts[activeIndex].id}`;
      //     navigate(`/search?q=${encodeURIComponent(input)}&sortby=popularity&order=1&page=1`);
      //     setSuggestedProducts([]);
      //     setActiveIndex(-1);
      //   }
      //   break;

      case 'Escape':
        inputRef.current.blur();
        setSuggestedProducts([]);
      default:
        break;
    }
  };

  // Clear the filtered data when clicked outside the input
  useEffect(() => {
    function handleClickOutside(e) {
      if (e.target.tagName !== 'INPUT' && e.target.parentNode.tagName !== 'A') {
        debouncedSuggest.cancel();
        setSuggestedProducts([]);
        inputRef.current.blur();
      }
    };

    if(suggestedProducts?.length) {
      document.addEventListener('click', handleClickOutside);
    }
    setActiveIndex(-1);
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [suggestedProducts]);

  //clearing the input when on homepage and category page
  useEffect(() => {

    if(location.pathname.slice(1).split('/')[0] === 'search') {
      setInput(decodeURIComponent(query));
      inputRef.current.blur();
    }
    else {
      setInput("")
      debouncedSuggest.cancel();
    }
    setSuggestedProducts([]);

  }, [location])

  useEffect(() => {
    return () => {
      debouncedSuggest.cancel();
    };
  }, []);
  
  const handleLogout = () => {
    dispatch(removeUser("logout"));
    dispatch(resetWishlist());
    dispatch(resetCart());
  }

  if (location.pathname === '/checkout') {
    return (
      <header className="sticky top-0 z-20 bg-blue-500 w-full flex items-center h-14 shadow-md">
        <Link to='/' className="ml-48">
          <div className="flex">
            <div className="flex-col relative">
              <img src="https://static-assets-web.flixcart.com/www/linchpin/fk-cp-zion/img/flipkart-plus_8d85f4.png" alt="Flipkart logo" width={70} style={{ background: "" }} />
              <span className="absolute right-1 top-3 text-yellow-300 text-lg font-semibold italic">Plus</span>
            </div>
            <div>
              <img src="https://static-assets-web.flixcart.com/www/linchpin/fk-cp-zion/img/plus_aef861.png" alt="star logo" />
            </div>
          </div>
        </Link>
      </header>
    );
  }

  return (
    <header className="fixed z-50 bg-[#2874f0] w-full flex items-center justify-center h-14 shadow-md">
      <div className="flex items-center gap-3 mr-14">
          <Link to='/'>
            <div className="flex">
                <div className="flex-col relative">
                    <img src={logoURL} alt="Flipkart logo" width={70} style={{background: ""}} />
                    <span className="absolute right-1 top-3 text-yellow-300 text-lg font-semibold italic">Plus</span>
                </div>
                <div className=""><img src={subURL} alt="star logo" /></div>
            </div>
          </Link>
          <div className="relative">
            <input 
              ref={inputRef} 
              type="text" 
              value={input} 
              onChange={handleChange}        //debounced suggestProducts api hit on keystroke
              onKeyUp={searchQueryHandler}   //for pressing enter and search icon click
              onKeyDown={handleKeyDown}      //for navigating suggested products with keyboard
              onFocus={handleFocus} 
              placeholder="Search for products, brands and more" 
              className="w-[36vw] h-9 placeholder-black/60 pl-4 focus:outline-none shadow-md rounded-sm focus:border-b-[1px]"
              aria-label="Search for products, brands and more"
              aria-haspopup="listbox"
              aria-expanded={suggestedProducts?.length > 0}
              />
              <button onClick={() => searchQueryHandler("searchButton")} className="absolute right-3 top-3">
                <svg
                  className=""
                  width="20"
                  height="20"
                  viewBox="0 0 17 18"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g fill="#2874F1" fillRule="evenodd">
                    <path
                      className="_34RNph"
                      d="m11.618 9.897l4.225 4.212c.092.092.101.232.02.313l-1.465 1.46c-.081.081-.221.072-.314-.02l-4.216-4.203"
                    ></path>
                    <path
                      className="_34RNph"
                      d="m6.486 10.901c-2.42 0-4.381-1.956-4.381-4.368 0-2.413 1.961-4.369 4.381-4.369 2.42 0 4.381 1.956 4.381 4.369 0 2.413-1.961 4.368-4.381 4.368m0-10.835c-3.582 0-6.486 2.895-6.486 6.467 0 3.572 2.904 6.467 6.486 6.467 3.582 0 6.486-2.895 6.486-6.467 0-3.572-2.904-6.467-6.486-6.467"
                    ></path>
                  </g>
                </svg>
              </button>
              {suggestedProducts?.length > 0 && 
                <ul className='absolute flex flex-col gap-1 bg-white w-[36vw] shadow-lg'>
                  {
                    suggestedProducts?.map((product, index) => 
                      <li 
                        key={index} 
                        className={`${index === activeIndex ? 'bg-blue-50': ''} h-14`}
                      >
                        <a 
                          className={`flex flex-row gap-4 px-2 hover:bg-blue-50`}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setInput(product.name);
                            inputRef.current.blur();
                            navigate(`/search?q=${encodeURIComponent(product.name)}&sortby=popularity&order=1&page=1`)
                            setSuggestedProducts([]);
                            setActiveIndex(-1);
                          }}
                        >
                          <img src={product.url} alt="" width='32'className="h-14 object-contain mix-blend-multiply" />
                          <span className="flex flex-col items-start my-auto">
                            <span className="text-gray-400 text-start text-xs font-medium">{product.brand}</span>
                            <span className="truncate text-sm">{product.name}</span>
                          </span>
                        </a>
                      </li>
                    )
                  }
                </ul>}
          </div>
      </div>
      <div className="flex items-center gap-10">
        { !currentUser?.name ?
            <button className="w-[112px] h-7 rounded-sm text-blue-500 text-[17px] cursor-pointer bg-white" onClick={() => setLoginModal(true)}>Login</button>
            :
            <div className="group inline-block relative">
              <button className="text-white py-2 px-4 rounded inline-flex items-center">
                <span className="mr-1">{currentUser?.name}</span>
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </button>
              <ul className="absolute hidden group-hover:block w-56 text-black shadow-lg bg-white rounded-sm divide-y-[1px]">
                <li className="hover:bg-gray-100 flex flex-row items-center">
                  <Link to='/account' className="w-full flex flex-row items-center justify-start gap-2 bg-white hover:bg-gray-100 py-4 px-4 whitespace-no-wrap cursor-pointer">
                    <CgProfile className='text-blue-600' />
                    <span className="text-sm">My Profile</span>
                  </Link>
                </li>
                <li className="hover:bg-gray-100 flex flex-row items-center">
                  <Link to='/orders' className="w-full flex flex-row items-center justify-start gap-2 bg-white hover:bg-gray-100 py-4 px-4 whitespace-no-wrap cursor-pointer">
                    <BsBoxSeam className='text-blue-600' />
                    <span className="text-sm">Orders</span>
                  </Link>
                </li>
                <li className="hover:bg-gray-100 flex flex-row items-center">
                  <Link to='/wishlist' className="w-full flex flex-row items-center justify-start gap-2 bg-white hover:bg-gray-100 py-4 px-4 whitespace-no-wrap cursor-pointer">
                    <AiFillHeart className='text-blue-600' />
                    <span className="text-sm">Wishlist</span>
                    {(currentUser && wishlistLength > 0) && 
                      <span className="absolute bg-white text-sm w-7 h-6 rounded-md bg-black/5 text-black/50 text-center right-4">
                        {wishlistLength}
                      </span>
                    }
                  </Link>
                </li>
                <li className="hover:bg-gray-100 flex flex-row items-center" onClick={handleLogout}>
                  <p className="w-full flex flex-row items-center justify-start gap-2 bg-white hover:bg-gray-100 py-4 px-4 whitespace-no-wrap cursor-pointer">
                    <RiShutDownLine className="text-blue-600" />
                    <span className="text-sm">Logout</span>
                  </p>
                </li>
              </ul>
          </div>
          }
          <div className="text-white font-medium cursor-pointer">Become a Seller</div>
          <div className="text-white font-medium cursor-pointer">More</div>
          {!(location.pathname === '/cart') && 
            <Link to='/cart'>
              <div className="text-white text-[17px] flex items-center gap-2">
                <span className="relative">
                  <svg width="18" height="18" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M15.32 2.405H4.887C3 2.405 2.46.805 2.46.805L2.257.21C2.208.085 2.083 0 1.946 0H.336C.1 0-.064.24.024.46l.644 1.945L3.11 9.767c.047.137.175.23.32.23h8.418l-.493 1.958H3.768l.002.003c-.017 0-.033-.003-.05-.003-1.06 0-1.92.86-1.92 1.92s.86 1.92 1.92 1.92c.99 0 1.805-.75 1.91-1.712l5.55.076c.12.922.91 1.636 1.867 1.636 1.04 0 1.885-.844 1.885-1.885 0-.866-.584-1.593-1.38-1.814l2.423-8.832c.12-.433-.206-.86-.655-.86"
                      fill="#fff">
                    </path>
                  </svg>
                  {(currentUser.name && cartLength > 0) && <span className="absolute -top-4 -right-3 w-[20px] h-[19px] rounded-lg bg-red-400 text-sm text-white flex flex-row justify-center items-center border-white border-[1px]">{cartLength}</span>}
                </span>
                cart
              </div>
            </Link>
          }
      </div>
    </header>
  );
};

export default Header;
