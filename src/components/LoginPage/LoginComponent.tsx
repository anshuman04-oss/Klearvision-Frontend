/* eslint-disable @typescript-eslint/no-wrapper-object-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable @typescript-eslint/no-unused-vars */
import {useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import { login as authLogin } from '../../features/loginSlice'
import {useDispatch} from "react-redux"
import {useForm} from "react-hook-form"
import axios from 'axios'
import API_BASE_URL, { Button, Input } from '../../constants'

function LoginComponent() {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {register, handleSubmit} = useForm()
    const [error, setError] = useState("")

    const login = async(data: Object) => {
        setError("")
        try {
            // Replace authService from the mega blog project with api call.
            console.log(data)
            const response = await axios.post(`${API_BASE_URL}/v1/login`, data)
            if(response) {
                const userData = await response.data
                if(userData) dispatch(authLogin(userData));
                console.log(userData)
                navigate("/")
            }
        } catch (error: any) {
            console.error(error)
            setError(error.message)
        }
    }

    return (
        <div className='flex justify-center items-center h-[90vh] w-full flex-col'>
            <h1 className='text-white font-bold text-4xl m-4'>Log into Klearvision Account</h1>
            <p className="my-2 text-center text-base text-gray-50">
                Don&apos;t have an account?&nbsp;
                <Link
                    // ToDo: Make User signup page.
                    to="/signup"
                    className="font-medium text-primary transition-all duration-200 hover:underline"
                >
                    Sign Up
                </Link>
            </p>
            {error && <p className="text-red-600 mt-8 text-center bg-gray-100 py-3 px-6">{error}</p>}
            <div className='bg-gray-900 text-gray-50 rounded-lg px-20 py-5'>
                <form 
                    onSubmit={handleSubmit(login)}
                    className='flex items-center justify-center flex-col rounded-lg'
                >
                    <div className='py-0 mt-0 mb-4'>
                    <p className='ml-16 py-1'>Login Id</p>
                    <Input 
                        label='loginId'
                        className='bg-gray-700 focus: border-gray-500 focus: ring-1 focus: ring-gray-800
                        outline-none text-gray-50 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out rounded-lg mt-0'
                        placeholder='Enter login id'
                        // value={userid}
                        // onChange={(e) => setUserid(e.target.value)}
                        {
                            ...register("loginId", {
                                required: true
                            })
                        }
                    />
                    </div>
                    
                    <div className='py-0 mt-0 mb-2'>
                    <p className='ml-16 p-1'>Password</p>
                    <Input 
                        label='password'
                        type="text" 
                        className='bg-gray-700 focus: border-gray-500 focus: ring-1 focus: ring-gray-800
                        outline-none text-gray-50 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out rounded-lg'
                        placeholder='Enter Password'
                        {
                            ...register("password", {
                                required: true
                            })
                        }
                        // value={password}
                        // onChange={(e) => setPassword(e.target.value)}
                    />
                    </div>
                    <Button
                        type='submit'
                        className='bg-blue-600 m-2 py-1 px-2 rounded'
                    >
                        Submit
                    </Button>
                </form>
                {status === "loading" && <p>loading</p>}
                {status === "failed" && <p className='text-red-500'>{error}</p>}
            </div>
        </div>
    )
}

export default LoginComponent















































// import React, { useState } from 'react'
// import { useDispatch }from 'react-redux'
// import { addUser } from '../../features/loginSlice';
// import UseAuth from '../../hooks/ValidateCredentials';

// function LoginPage() {

//     const [userid, setUserid] = useState("");
//     const [password, setPassword] = useState("")
//     const { validateCredentials, status, error } = UseAuth()
//     const dispatch = useDispatch();

//     const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//         e.preventDefault()
//         await validateCredentials(userid, password)
//     }

//     return (
//         <div className='flex justify-center items-center h-[90vh] w-full flex-col'>
//             <h1 className='text-white font-bold text-4xl m-4'>Log into Klearvision Account</h1>
//             <div className='bg-gray-900 text-gray-50 rounded-lg px-8 py-5'>
//                 <form 
//                     onSubmit={handleSubmit}
//                     className='flex items-center justify-center flex-col rounded-lg'
//                 >User Id
//                     <input 
//                         type="text"
//                         className='bg-gray-700 focus: border-gray-500 focus: ring-1 focus: ring-gray-800
//                         outline-none text-gray-50 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out rounded-lg'
//                         placeholder='Enter userid'
//                         value={userid}
//                         onChange={(e) => setUserid(e.target.value)}
//                     />
//                 Password
//                     <input 
//                         type="text" 
//                         className='bg-gray-700 focus: border-gray-500 focus: ring-1 focus: ring-gray-800
//                         outline-none text-gray-50 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out rounded-lg'
//                         placeholder='Enter Password'
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                     />
//                     <button
//                         type='submit'
//                         className='bg-blue-600 m-2 py-1 px-2 rounded'
//                     >
//                         Submit
//                     </button>
//                 </form>
//                 {status === "loading" && <p>loading</p>}
//                 {status === "failed" && <p className='text-red-500'>{error}</p>}
//             </div>
//         </div>
//     )
// }

// export default LoginPage
