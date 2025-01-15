/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { forwardRef } from "react";
import { useId } from "react";
import { SelectProps } from "../types";

function Select ({
    options = [],
    label = "",
    className = "",
    ...props
}, ref) {
    // Ask about the red line indicating error
    const id = useId()

    return (
        <div className="w-full">
            { label && <label htmlFor="id">{label}</label> }
            <select 
                {...props}
                id={id}
                ref = {ref}
                className={`py-2 px-3 rounded-lg bg-gray-700 text-gray-50 outline-none focus:bg-blue-500 duration-200 border border-gray-600 w-full ${className}`}
                >
                    {options?.map((option) => (
                        <option value={option} key={option}>
                            {option}
                        </option>
                    ))}
            </select>
        </div>
    )
}

export default forwardRef(Select)