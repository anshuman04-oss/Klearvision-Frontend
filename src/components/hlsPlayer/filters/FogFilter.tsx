import { Slider } from '@mui/material'

function FogFilter() {
    const filters = ["Pre Enhancement", "Post Enhancement", "Brightness", "Visual Enhancement"]
    return (
        <div>
        {/* <h2 className="text-gray-50 font-bold mt-5">Apply Filters</h2> */}
            <div className="flex justify-center mt-5">
            {filters.map((filter, index) => (
                <div key={index} className="rounded-sm border border-gray-500 shadow-sm shadow shadow-gray-600 w-1/4 bo mx-4 text-gray-700 font-bold bg-gray-300">
                {filter}
                <Slider />
                </div>
            ))}
            </div>
        </div>
    )
}

export default FogFilter
