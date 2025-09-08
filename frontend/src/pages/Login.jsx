    import React, { useState } from 'react'
    import { useNavigate } from 'react-router-dom'
    import axios from 'axios'
    import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
    import { toast } from "react-toastify";

    const Login = () => {
        const [username, setUsername] = useState('');
        const [password, setPassword] = useState('');
        const [passVisible, setPassVisible] = useState(false);
        const navigate = useNavigate();
        const pp = "https://pulseplay-8e09.onrender.com"
        const localhost = "http://localhost:4000"

        const handlePassVisibility = () => {
            setPassVisible(!passVisible);
        }

        const handleLogin = async (e) => {
            e.preventDefault();
            try {
                const res = await axios.post(`${pp}/api/login`,
                    {username, password},   
                    { withCredentials: true }
                );
                toast.success("Logged in")  
                navigate("/")
            } catch (error) {
                console.log("Login error:", error);
                if (error.response) {
                    toast.error(error.response.data.message || "Login failed");
                } else {
                    toast.error("Network error, please try again");
                }
            }
        }

        return (
            <div className='flex justify-center items-center h-screen w-full bg-[#1A1824] overflow-hidden'>
                <div className='w-auto h-auto rounded-md'>
                    <div className='flex flex-col items-center'>
                        <form className='flex flex-col gap-20' onSubmit={handleLogin}>
                            <div>
                                <h1 className='text-2xl text-white font-bold border-b border-amber-600'>LOGIN FORM</h1>
                            </div>

                            <div className='flex flex-col gap-10'>
                                {/* Username Input */}
                                <div>
                                    <h1 className='text-white font-bold pl-3'>USERNAME</h1>
                                    <input
                                        className='h-10 w-70 border-0 bg-[#555C7C] rounded-2xl px-4 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-600'
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder="Enter username"
                                        required
                                    />
                                </div>

                                {/* Password Input */}
                                <div>
                                    <h1 className='text-white font-bold pl-3'>PASSWORD</h1>
                                    <div className='flex justify-between items-center h-10 w-70 px-4 bg-[#555C7C] rounded-2xl focus-within:ring-2 focus-within:ring-amber-600'>
                                        <input
                                            className='bg-transparent text-white placeholder-gray-300 flex-1 outline-none border-none focus:outline-none'
                                            onChange={(e) => setPassword(e.target.value)}
                                            type={passVisible ? "text" : "password"}
                                            value={password}
                                            placeholder="Enter password"
                                            required
                                        />
                                        <div onClick={handlePassVisibility} className='cursor-pointer ml-2'>
                                            {passVisible ?
                                                <FaRegEyeSlash size={20} className='text-white hover:text-amber-600 transition-colors' /> :
                                                <FaRegEye size={20} className='text-white hover:text-amber-600 transition-colors' />
                                            }
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div>
                                    <button
                                        className='h-10 w-70 bg-[#1059FF] rounded-2xl text-white font-bold hover:bg-[#0d4dd1] transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400'
                                        type='submit'
                                    >
                                        Login
                                    </button>
                                </div>

                                {/* Register Link */}
                                <div className='text-center'>
                                    <p className='text-gray-300 text-sm'>
                                        Don't have an account?{' '}
                                        <span
                                            onClick={() => navigate('/register')}
                                            className='text-amber-600 cursor-pointer hover:text-amber-500 transition-colors font-semibold underline'
                                        >
                                            Register here
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }

    export default Login;
