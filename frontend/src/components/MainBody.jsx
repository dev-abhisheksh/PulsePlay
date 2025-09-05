import React from 'react'

const MainBody = () => {
    return (
        <div className='w-[55vw] h-screen bg-[#1A1824] flex justify-center overflow-hidden '>
            <div className='relative top-10 flex gap-10 flex-col'>
                <div className='h-11'>
                    <input type="text" className='border rounded-md placeholder-shown:Search h-10 w-[48vw] bg-[#393939]' />
                </div>
                <div className='h-60 w-[48vw] bg-white rounded-md'>
                </div>
                <div>
                    <h1 className='text-white text-3xl font-bold'>Popular</h1>
                </div>
                <div className='flex flex-col gap-5 overflow-y-auto'>
                    <div className='h-20 w-[48vw] bg-red-400 rounded-md'></div>
                    <div className='h-20 w-[48vw] bg-red-400 rounded-md'></div>
                    {/* <div className='h-20 w-[48vw] bg-red-400 rounded-md'></div>
                    <div className='h-20 w-[48vw] bg-red-400 rounded-md'></div> */}
                </div>
            </div>
        </div>
    )
}

export default MainBody