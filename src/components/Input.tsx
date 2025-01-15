/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { useId } from "react";
import { InputProps } from "../types";

const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input({
    label,
    type = "text",
    className = "",
    ...props
}, ref){
    const id = useId()
    return (
        <div>
            {label && <label
                className='inline-block mb-1 pl-1' 
                htmlFor={id}
                >
                </label>
            }
            <input
            type={type}
            className={`px-3 py-2 rounded-lg bg-gray-700 text-gray-200 outline-none focus:bg-gray-800 duration-200 border border-gray-200 ${className}`}
            ref={ref}
            {...props}
            id={id}
            >
            </input>
        </div>
    )
}) 

export default Input