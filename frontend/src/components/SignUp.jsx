import React, { useEffect, useRef, useState } from 'react'
import Login from './Login'
import { AiOutlineClose } from 'react-icons/ai'
import { LuEye, LuEyeOff } from "react-icons/lu";
import { useDispatch, useSelector } from 'react-redux'
import { authUserAsync, setError } from '../reducers/auth/authSlice'
import Loader from './Loader'
import { useModal } from '../context/ModalContext';

const SignUp = ({toggleSignUp, setToggleSignUp}) => {

    const { setLoginModal } = useModal();

    const { currentUser, loading, error } = useSelector(state => state.auth);
    const [showPassword, setShowPassword] = useState(false);
    const [input, setInput] = useState(
        {
        name: '',
        email: '', 
        password: ''
        })

    const dispatch = useDispatch();

    const handleChange = (e) => {
        setInput({ 
            ...input, [e.target.name]: e.target.value
        })
    }

    const signUp = (e) => {
        e.preventDefault();
        dispatch(authUserAsync({type: 'signup', input})); 
    }

    function closeModal() {
        dispatch(setError(null));
        setLoginModal(false);
    }

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    useEffect(() => {
        if (currentUser.name) {
          setLoginModal(false);
        }
    }, [currentUser.name, loading]);

    const nameRef = useRef()
    useEffect(() => {
        nameRef.current.focus()
    }, [])
    
  return (
    <>
    {/* {!toggleSignUp ? 
        <Login />
        :  */}
    <div className='fixed top-0 left-0 bg-black/50 flex justify-center items-center w-full h-screen z-30' onClick={closeModal}>
        <div className="w-[44vw] h-[73vh] flex flex-row relative" onClick={(e) => e.stopPropagation()}>
            <div className='flex h-full w-[40%]'>
                <div className="bg-[url('https://static-assets-web.flixcart.com/www/linchpin/fk-cp-zion/img/login_img_c4a81e.png')] flex-1 bg-no-repeat bg-blue-500 bg-[center_bottom_3.5rem]">
                    <div className='flex flex-col mt-7 gap-4 w-40 mx-auto'>
                        <h3 className='text-white text-[28px] font-semibold leading-8'>Looks like you're new here!</h3>
                        <p className='text-gray-200 text-[17px] '>Sign up with your email to get started</p>
                    </div>
                </div>
            </div>
            <form onSubmit={signUp} onChange={handleChange} className='w-[60%] flex justify-center bg-white'>
                <div className='flex flex-col items-center w-[86%]'>
                    {/* name */}
                    <div className="relative z-0 w-full items-center mt-12">
                        <input ref={nameRef} type="text" name="name" defaultValue={input.name} className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-[1px] border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer caret-black" placeholder=" " />
                        <label htmlFor="floating_standard" className="absolute text-gray-500 dark:text-gray-400 duration-[280ms] ease-in-out transform -translate-y-6 scale-[80%] top-3 left-0 -z-10 origin-[0] peer-focus:left-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-[80%] peer-focus:-translate-y-6">Enter Name</label>
                    </div>
                    {/* signUpEmail */}
                    <div className="relative z-0 w-full items-center mt-6">
                        <input required type="email" name="email" defaultValue={input.email} className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-[1px] border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer caret-black" placeholder=" " />
                        <label htmlFor="floating_standard" className="absolute text-gray-500 dark:text-gray-400 duration-[280ms] ease-in-out transform -translate-y-6 scale-[80%] top-3 left-0 -z-10 origin-[0] peer-focus:left-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-[80%] peer-focus:-translate-y-6">Enter Email</label>
                    </div>
                    {/* signUpPassword */}
                    <div className="relative z-0 w-full items-center mt-6">
                        <input required type={showPassword ? 'text' : 'password'} name="password" defaultValue={input.password} className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-[1px] border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer caret-black" placeholder=" " />
                        <label htmlFor="floating_standard" className="absolute text-gray-500 dark:text-gray-400 duration-[280ms] ease-in-out transform -translate-y-6 scale-[80%] top-3 left-0 -z-10 origin-[0] peer-focus:left-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-[80%] peer-focus:-translate-y-6">Enter Password</label>
                        <span
                        className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                        onClick={toggleShowPassword}
                        >
                            {showPassword ? <LuEye /> : <LuEyeOff />}
                        </span>
                    </div>
                    <p className='text-gray-500 text-xs mt-8'>By continuing, you agree to Flipkart's <span className='text-blue-500'>Terms of Use</span> and <span className='text-blue-500'>Privacy Policy</span>.</p>
                    <button className={`${loading ? 'bg-[#ca7d57]' : 'bg-[#FB641B]'} ${error ? 'animate-shake' : ''} text-white w-full rounded-sm h-12 mt-3`}>{loading ? <span className='flex flex-row justify-center'>'Signing up...' <Loader width='20px' height='20px' /></span> : 'Continue'}</button>
                    <button onClick={(e) => {e.preventDefault(); setToggleSignUp(false);}} className='text-blue-500 w-full rounded-sm h-12 shadow-[0_2px_4px_0px_rgba(0,0,0,0.2)] mt-4'>Existing User? Log in</button>
                    <div className={`text-red-500 mt-3 text-center ${error ? 'animate-shake' : ''}`}>
                        {error}
                    </div>
                </div>
            </form>
            <AiOutlineClose className='absolute -right-10 cursor-pointer' color='white' size='35px' onClick={closeModal} />
        </div>
    </div>
    {/* } */}
    </>
  )
}

export default SignUp