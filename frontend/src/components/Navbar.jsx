import React from 'react'
import { FaHome, FaSearch, FaMusic, FaDownload } from "react-icons/fa";


const Navbar = () => {
    return (
        <div className='w-[16vw] h-screen bg-[#1A1824] flex justify-center overflow-hidden'>
            <div className='relative top-10 flex gap-12 flex-col items-center'>
                <h1 className='text-white text-4xl font-poppins font-bold '>PulsePlay</h1>
                <div className='flex gap-10 flex-col'>
                    <FaHome size={30} className='text-white ' />
                    <FaSearch size={25} className='text-white' />
                    <FaMusic size={25} className='text-white' />
                    <FaDownload size={25} className='text-white' />
                </div>
            </div>
        </div>
    )
}

export default Navbar