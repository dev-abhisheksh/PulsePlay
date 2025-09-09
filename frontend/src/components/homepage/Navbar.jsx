import React, { useEffect, useState } from 'react'
import { FaArrowAltCircleLeft, FaPlay, FaArrowAltCircleRight, FaPause, FaAlignJustify, FaAlignRight, FaHome, FaSearch, FaMusic, FaDownload } from "react-icons/fa";
import { MdPlaylistAddCheckCircle, MdPlaylistAddCircle, MdLoop, MdOutlineShuffle, MdAdminPanelSettings } from "react-icons/md";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Navbar = () => {

    const [menuBarToggle, setMenuBarToggle] = useState(true)
    const [user, setUser] = useState(null)
    const navigate = useNavigate()
    const [isAdmin, setIsAdmin] = useState(false)
    const pp = "https://pulseplay-8e09.onrender.com"
    const localhost = "http://localhost:4000"

    const handleLogout = async () => {
        await axios.get(`${pp}/api/logout`, { withCredentials: true })
        navigate("/login");
        toast.success("Logged out")
    }

    useEffect(() => {
        const fetchUsers = async () => {
            const res = await axios.get(`${pp}/api/verify`, { withCredentials: true })
            const userData = res.data.user;
            setUser(userData)
            if (userData && userData.role === "admin") {
                setIsAdmin(true)
            }

            console.log(res.data)
        }

        fetchUsers()
    }, [])

    return (
        <div>
            <div className=' bg-[#1A1824] h-[11vh] w-full '>
                <div className='flex items-center justify-between h-full px-7 py-2 font-bold'>
                    <div>
                        <h1 className='text-white text-2xl font-bold'>PulsePlay</h1>
                    </div>
                    <div onClick={() => setMenuBarToggle(!menuBarToggle)} className="relative w-6 h-6 cursor-pointer">
                        {menuBarToggle ? (<FaAlignJustify size={24} className='text-white' />) : <FaAlignRight size={24} className='text-white' />}
                    </div>
                </div>
            </div>

            <div
                className={`fixed top-0 left-0 h-full w-[75%] border-r-2 flex flex-col gap-10 border-white bg-black bg-opacity-40 transform transition-transform duration-500 ease-in-out z-40
                    ${menuBarToggle ? "-translate-x-full" : "translate-x-0"}`}
            >
                <h2 className="pl-7 pt-5  text-white text-2xl font-bold">PulsePlay</h2>
                <div className='flex flex-col justify-between h-screen pb-10 px-3'>
                    <ul className="flex flex-col gap-7 p-4 text-white">
                        <div className='flex items-center gap-6'>
                            <FaHome size={25} className='text-white ' />
                            <Link to="/" >Home</Link>
                        </div>
                        <div className='flex items-center gap-6'>
                            <FaSearch size={20} className='text-white' />
                            <h1>Search</h1>
                        </div>
                        <div className='flex items-center gap-6'>
                            <FaMusic size={20} className='text-white' />
                            <h1>PlayList</h1>
                        </div>
                        <div className='flex items-center gap-6'>
                            <FaDownload size={20} className='text-white' />
                            <h1>Download</h1>
                        </div>

                        {isAdmin ? (<div className='flex items-center gap-6'>
                            <MdAdminPanelSettings size={27} className='text-white' />
                            <Link to="admin">
                                Admin
                            </Link>
                        </div>) : ""}
                    </ul>

                    <div className='px-3 flex justify-between items-center'>
                        <h1 className='text-white text-2xl'>{user ? user.username : "user"}</h1>
                        <button onClick={handleLogout} className='text-white text-sm border border-[#FD830D] px-2 py-1 rounded-md'>LogOut</button>
                    </div>
                </div>

                
            </div>
 {!menuBarToggle && (
          <div
            className="fixed inset-0 bg-opacity-40 z-30"
            onClick={() => setMenuBarToggle(true)}
          ></div>
        )}
        </div>

    )
}

export default Navbar