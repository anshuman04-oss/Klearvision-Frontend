/* eslint-disable @typescript-eslint/no-unused-vars */
import { Link, useNavigate } from "react-router-dom";
import {useDispatch} from "react-redux"
import { useState } from "react";
import { useForm } from "react-hook-form"
import API_BASE_URL, { Button, Input } from "../../constants";
import axios from "axios";
import { login } from "../../features/loginSlice";

export default function Signup() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [error, setError] = useState("")
    const { register, handleSubmit } = useForm()

    const signup = async (data: any) => {
        setError("")
        try {
            const userData = await axios.post(`${API_BASE_URL}/v1/signup`, data)    // This will post the user data in the database. Before that, we need to search in the database.
            if(userData) {
                // const userData = await authService.getCurrentUser()
                // We need to search the data of the user in the database. If match is found, redirect him to 
                // the login page.
                dispatch(login(userData))
                navigate("/")
            }
        } catch (error : any) {
            setError(error.message);
        }
    }
    return (
        <div className='flex justify-center items-center h-[90vh] w-full flex-col'>
            <h1 className='text-white font-bold text-4xl m-2'>Create your Klearvision account</h1>
            <p className="my-2 text-center text-base text-gray-50">
                Already have an account?&nbsp;
                <Link
                    // ToDo: Make User signup page.
                    to="/login"
                    className="font-medium text-primary transition-all duration-200 hover:underline"
                >
                    Login
                </Link>
            </p>
            {error && <p className="text-red-600 mt-8 text-center bg-gray-100 py-3 px-6">{error}</p>}
            <div className='bg-gray-900 text-gray-50 rounded-lg px-8 py-5'>
                <form 
                    onSubmit={handleSubmit(signup)}
                    className='flex items-center justify-center flex-col rounded-lg px-20'
                >First Name
                    <Input 
                        label='firstName'
                        className='bg-gray-700 focus: border-gray-500 focus: ring-1 focus: ring-gray-800
                        outline-none text-gray-50 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out rounded-lg w-96'
                        placeholder='Enter your first name'
                        // value={userid}
                        // onChange={(e) => setUserid(e.target.value)}
                        {
                            ...register("firstName", {
                                required: true
                            })
                        }
                    />
                Last Name
                    <Input 
                        label='lastName'
                        className='bg-gray-700 focus: border-gray-500 focus: ring-1 focus: ring-gray-800
                        outline-none text-gray-50 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out rounded-lg'
                        placeholder='Enter your last name'
                        // value={userid}
                        // onChange={(e) => setUserid(e.target.value)}
                        {
                            ...register("lastName", {
                                required: true
                            })
                        }
                    />
                Email Id
                    <Input 
                        label='mail'
                        className='bg-gray-700 focus: border-gray-500 focus: ring-1 focus: ring-gray-800
                        outline-none text-gray-50 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out rounded-lg'
                        placeholder='Enter your email id'
                        // value={userid}
                        // onChange={(e) => setUserid(e.target.value)}
                        {
                            ...register("mail", {
                                required: true
                            })
                        }
                    />
                Phone Number
                    <Input 
                        label='phNo'
                        className='bg-gray-700 focus: border-gray-500 focus: ring-1 focus: ring-gray-800
                        outline-none text-gray-50 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out rounded-lg'
                        placeholder='Enter your email id'
                        // value={userid}
                        // onChange={(e) => setUserid(e.target.value)}
                        {
                            ...register("phNo", {
                                required: true
                            })
                        }
                    />
                Password
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
)}






























// curl --location 'http://43.204.219.57:5000/api/v1/register' \
// --header 'Content-Type: application/json' \
// --data-raw '{
//    "FistName" : "jack1",
//    "lastName" : "rayan1",
//    "mail":"kvision@12345",
//    "phNo":"123334444455",
//    "password":"klearvision@123"
// }'

// OUTPUT
// {
//     "userId": "003fb836-24e2-48aa-b9df-97573fb49727",
//     "FistName": "jack1",
//     "lastName": "rayan1",
//     "mail": "kvision@12345",
//     "phNo": "123334444455"
// }