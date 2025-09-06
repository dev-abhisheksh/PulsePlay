import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";

const Register = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('') // Added confirm password
    const [passVisible, setPassVisible] = useState(false)
    const [confirmPassVisible, setConfirmPassVisible] = useState(false)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handlePassVisibility = () => {
        setPassVisible(!passVisible)
    }

    const handleConfirmPassVisibility = () => {
        setConfirmPassVisible(!confirmPassVisible)
    }

    const handleRegister = async (e) => {
        e.preventDefault();
        
        // Basic validation
        if (password !== confirmPassword) {
            toast.error("Passwords don't match!");
            return;
        }

        // if (password.length < 6) {
        //     toast.error("Password must be at least 6 characters!");
        //     return;
        // }

        setLoading(true);

        try {
            const res = await axios.post("https://pulseplay-8e09.onrender.com/api/register", { 
                username, 
                password 
            }, {
                withCredentials: true
            });

            toast.success("Registration successful! 🎉");
            
            // Optional: Auto-login after registration
            setTimeout(() => {
                navigate("/login");
            }, 1500);

        } catch (error) {
            console.log("Registration Error", error);
            
            // Handle specific error messages
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else if (error.response?.status === 409) {
                toast.error("Username already exists!");
            } else {
                toast.error("Registration failed. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='flex justify-center items-center h-screen bg-[#1A1824]'>
            <div className='w-auto h-auto rounded-md'>
                <div className='flex flex-col items-center'>
                    <form className='flex flex-col gap-16' onSubmit={handleRegister}>
                        <div>
                            <h1 className='text-2xl text-white font-bold border-b border-amber-600'>REGISTER FORM</h1>
                        </div>

                        <div className='flex flex-col gap-8'>
                            {/* Username Input */}
                            <div>
                                <h1 className='text-white font-bold pl-3 mb-2'>USERNAME</h1>
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
                                <h1 className='text-white font-bold pl-3 mb-2'>PASSWORD</h1>
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

                            {/* Confirm Password Input */}
                            <div>
                                <h1 className='text-white font-bold pl-3 mb-2'>CONFIRM PASSWORD</h1>
                                <div className='flex justify-between items-center h-10 w-70 px-4 bg-[#555C7C] rounded-2xl focus-within:ring-2 focus-within:ring-amber-600'>
                                    <input
                                        className='bg-transparent text-white placeholder-gray-300 flex-1 outline-none border-none focus:outline-none'
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        type={confirmPassVisible ? "text" : "password"}
                                        value={confirmPassword}
                                        placeholder="Confirm password"
                                        required
                                    />
                                    <div onClick={handleConfirmPassVisibility} className='cursor-pointer ml-2'>
                                        {confirmPassVisible ?
                                            <FaRegEyeSlash size={20} className='text-white hover:text-amber-600 transition-colors' /> :
                                            <FaRegEye size={20} className='text-white hover:text-amber-600 transition-colors' />
                                        }
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div>
                                <button
                                    className='h-10 w-70 bg-[#1059FF] rounded-2xl text-white font-bold hover:bg-[#0d4dd1] transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed'
                                    type='submit'
                                    disabled={loading}
                                >
                                    {loading ? "REGISTERING..." : "REGISTER"}
                                </button>
                            </div>

                            {/* Login Link */}
                            <div className='text-center'>
                                <p className='text-gray-300 text-sm'>
                                    Already have an account?{' '}
                                    <span 
                                        onClick={() => navigate('/login')}
                                        className='text-amber-600 cursor-pointer hover:text-amber-500 transition-colors font-semibold'
                                    >
                                        Login here
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

export default Register