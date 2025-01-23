import { Slider } from '@mui/material'
import React from 'react'

function RainFilter() {
    const filters = ["Threshold", "Brightness", "Post Enhancement"]
    return (
        <>
            <h2 className="text-gray-50 font-bold mt-5">Apply Filters</h2>
            <div className="flex justify-center mt-5">
            {filters.map((filter, index) => (
                <div key={index} className="rounded-sm border border-gray-500 shadow-sm shadow shadow-gray-400 w-1/4 bo mx-5 text-gray-700 font-bold bg-gray-300">
                {filter}
                <Slider />
                </div>
            ))}
            </div>
        </>
    )
}

export default RainFilter
