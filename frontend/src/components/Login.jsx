import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import SignUp from './SignUp'
import { AiOutlineClose } from 'react-icons/ai'
import { LuEye, LuEyeOff } from "react-icons/lu";
import { authUserAsync, setError } from '../reducers/auth/authSlice'
import Loader from './Loader';
import { useModal } from '../context/ModalContext';

const Login = () => {

    const { loginModal, setLoginModal } = useModal();

    const { currentUser, loading, error } = useSelector(state => state.auth);
    const [showPassword, setShowPassword] = useState(false);
    const [toggleSignUp, setToggleSignUp] = useState(false);
    const [input, setInput] = useState({ 
        email: '', 
        password: '' 
    });

    const dispatch = useDispatch();

    const handleChange = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }
    
    const login = async (e) => {
        e.preventDefault();
        if(input.email === '' || input.password === '') {
            dispatch(setError("All fields must be filled !"))
            return;
        }
        dispatch(authUserAsync({ type: 'login', input }));
    }

    function closeModal() {
        dispatch(setError(null));
        setLoginModal(false);
    }

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    useEffect(() => {
        if (currentUser?.name) {
          setLoginModal(false);
        }
    }, [currentUser?.name, loading]);

    const emailRef = useRef()
    useEffect(() => {
        if(loginModal && !toggleSignUp) {
            setInput({ email: '', password: '' });
            dispatch(setError(null));
            emailRef?.current.focus();
        }
    }, [loginModal, toggleSignUp]);

    if(!loginModal)
        return null;

  return (
    <>
    {!toggleSignUp ? 
    <div className='fixed top-0 left-0 z-[100] bg-black/50 flex justify-center items-center w-full h-screen' onClick={closeModal}>
        <div className="w-[44vw] h-[73vh] flex flex-row relative" onClick={(e) => e.stopPropagation()}>
            <div className='flex h-full w-[40%]'>
                <div className="bg-[url('https://static-assets-web.flixcart.com/www/linchpin/fk-cp-zion/img/login_img_c4a81e.png')] flex-1 bg-no-repeat bg-blue-500 bg-[center_bottom_3.5rem]">
                    <div className='flex flex-col justify-center items-center mx-auto mt-7 w-40 gap-2'>
                        <h3 className='text-white text-[28px] font-semibold'>Login</h3>
                        <p className='text-gray-200 text-[17px]'>Get access to your Orders, Wishlist and Recommendations</p>
                    </div>
                </div>
            </div>
            <form onSubmit={login} onChange={handleChange} className='w-[60%] flex justify-center bg-white'>
                <div className='flex flex-col items-center w-[86%]'>
                    {/* login email */}
                    <div className="relative z-0 w-full items-center mt-12">
                        <input 
                            ref={emailRef} 
                            type="email" 
                            value={input.email} 
                            name="email"
                            id='email'
                            placeholder=" " 
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-[1px] border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer caret-black" 
                        />
                        <label 
                            htmlFor="email" 
                            className="absolute text-gray-500 dark:text-gray-400 duration-[280ms] ease-in-out transform -translate-y-6 scale-[80%] top-3 left-0 -z-10 origin-[0] peer-focus:left-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-[80%] peer-focus:-translate-y-6"
                        >
                            Enter Email/Mobile Number
                        </label>
                    </div>
                    {/* login password */}
                    <div className="relative z-0 w-full items-center mt-6">
                        <input 
                            type={showPassword ? 'text' : 'password'} 
                            name="password" 
                            value={input.password} 
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-[1px] border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer caret-black" 
                            placeholder=" " 
                        />
                        <label 
                            htmlFor="floating_standard" 
                            className="absolute text-gray-500 dark:text-gray-400 duration-[280ms] ease-in-out transform -translate-y-6 scale-[80%] top-3 left-0 -z-10 origin-[0] peer-focus:left-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-[80%] peer-focus:-translate-y-6"
                        >
                            Enter Password
                        </label>
                        <span
                        className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                        onClick={toggleShowPassword}
                        >
                            {showPassword ? <LuEye /> : <LuEyeOff />}
                        </span>
                    </div>
                    <p className='text-gray-500 text-xs mt-8'>By continuing, you agree to Flipkart's <span className='text-blue-500'>Terms of Use</span> and <span className='text-blue-500'>Privacy Policy</span>.</p>
                    <button className={`${loading ? 'bg-[#ca7d57]' : 'bg-[#FB641B]'} text-white w-full rounded-sm h-12 mt-4 ${error ? 'animate-shake' : ''}`}>{loading ? <span className='flex flex-row justify-center'>Logging in...<Loader size='20px' /></span> : 'Login'}</button>
                    {/* <p className='mt-2 mb-2'>OR</p> */}
                    {/* <button className='text-blue-500 w-full rounded-sm h-12 shadow-[0_2px_4px_0px_rgba(0,0,0,0.2)]'>Request OTP</button> */}
                    {error ? <div className={`text-red-500 text-center mt-2 ${error ? 'animate-shake' : ''}`}>
                        {error}
                    </div> : ""}
                    <button onClick={(e) => {e.preventDefault(); setToggleSignUp(true)}} className='text-blue-600 text-sm font-medium mt-8'>New to Flipkart? Create an account</button>
                    
                </div>
            </form>
            <AiOutlineClose className='absolute -right-10 cursor-pointer' color='white' size='35px' onClick={closeModal} />
        </div>
    </div>
        :
    <SignUp setLoginModal={setLoginModal} toggleSignUp={toggleSignUp} setToggleSignUp={setToggleSignUp} />
    }
    </>
  )
};

export default Login