/* eslint-disable @typescript-eslint/no-wrapper-object-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable @typescript-eslint/no-unused-vars */

import useAuth from '../../hooks/useAuth'
import Loading from '../Loading'
import { LoginFormData } from '../../types'
import { useForm } from 'react-hook-form';
import { Link } from 'react-router';
import { Status } from '../../constants';
import Button from '../Button';
import Input from '../Input';

// I have put the login form data in the index file of the types folder

function LoginComponent() {

    const {register, handleSubmit} = useForm<LoginFormData>()
    const {error, status, isAuthenticated, loginUser} = useAuth();

    const onSubmit = (data: LoginFormData) => {
        console.log('Form submitted', data)
        if(!isAuthenticated && status !== Status.LOADING) {
            loginUser(data.username, data.password)
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
                    onSubmit={handleSubmit(onSubmit)}
                    className='flex items-center justify-center flex-col rounded-lg'
                >
                    <div className='py-0 mt-0 mb-4'>
                    <p className='ml-16 py-1'>Username</p>
                    <Input 
                        label='username'
                        className='bg-gray-700 focus: border-gray-500 focus: ring-1 focus: ring-gray-800
                        outline-none text-gray-50 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out rounded-lg mt-0'
                        placeholder='Enter username'
                        // value={userid}
                        // onChange={(e) => setUserid(e.target.value)}
                        {
                            ...register("username", {
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
                {status === Status.LOADING && <Loading />}
                {status === Status.FAILED && <p className='text-red-500'>{error}</p>}
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
