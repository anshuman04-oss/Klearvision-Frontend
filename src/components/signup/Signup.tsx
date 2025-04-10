/* eslint-disable @typescript-eslint/no-unused-vars */
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form"
import useAuth from "../../hooks/useAuth";
import { User } from "../../types";
import Loading from "../Loading";
import { TextField, Button } from "@mui/material";
import { Status } from "../../constants";

type SignUpFormData = {
    firstName   : string
    lastName    : string | undefined
    email       : number | string
    phone       : string
    password    : string | undefined
}

export default function Signup() {
    const {error, status, signupUser} = useAuth();
    const { register, handleSubmit } = useForm<SignUpFormData>()
    

    const onSubmit = (data: SignUpFormData) => {
        const user = data as User;
        signupUser(user);
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
                    onSubmit={handleSubmit(onSubmit)}
                    className='flex items-center justify-center flex-col rounded-lg px-20'
                >
                    <TextField 
                        label='First Name'
                        className='bg-gray-700 focus: border-gray-500 focus: ring-1 focus: ring-gray-800
                        outline-none text-gray-50 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out rounded-lg w-96'
                        placeholder='Enter your first name'
                        {
                            ...register("firstName", {
                                required: true
                            })
                        }
                    />
                    <TextField 
                        label='Last Name'
                        className='bg-gray-700 focus: border-gray-500 focus: ring-1 focus: ring-gray-800
                        outline-none text-gray-50 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out rounded-lg'
                        placeholder='Enter your last name'
                        {
                            ...register("lastName", {
                                required: false
                            })
                        }
                    />
                    <TextField 
                        label='Email Id'
                        className='bg-gray-700 focus: border-gray-500 focus: ring-1 focus: ring-gray-800
                        outline-none text-gray-50 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out rounded-lg'
                        placeholder='Enter your email id'
                        {
                            ...register("email", {
                                required: true
                            })
                        }
                    />
                    <TextField 
                        label='Phone Number'
                        className='bg-gray-700 focus: border-gray-500 focus: ring-1 focus: ring-gray-800
                        outline-none text-gray-50 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out rounded-lg'
                        placeholder='Enter your phone number'
                        {
                            ...register("phone", {
                                required: true
                            })
                        }
                    />
                    <TextField 
                        label='Password'
                        type="password" 
                        className='bg-gray-700 focus: border-gray-500 focus: ring-1 focus: ring-gray-800
                        outline-none text-gray-50 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out rounded-lg'
                        placeholder='Enter Password'
                        {
                            ...register("password", {
                                required: true
                            })
                        }
                    />
                    <Button
                        type='submit'
                        className='bg-blue-600 m-2 py-1 px-2 rounded'
                    >
                        Submit
                    </Button>
                </form>
                {status === Status.LOADING && <Loading />}
                {status === Status.FAILED && <p className='text-red-500'>{error}</p>}
            </div>
        </div>
    )
}