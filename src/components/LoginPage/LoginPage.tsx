/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react'
import { useDispatch }from 'react-redux'
import { addUser } from '../../features/loginSlice';
import useAuth from '../../hooks/validateCredentials';

function LoginPage() {

    const [userid, setUserid] = useState("");
    const [password, setPassword] = useState("")
    const { validateCredentials, status, error } = useAuth()
    const dispatch = useDispatch();

    // const handleSubmit = (e: any) => {
    //     e.preventDefault();
    //     dispatch(addUser({userid, password}));
    //     console.log(userid)
    //     console.log(password)
    //     setUserid('')
    //     setPassword('')
    // }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        await validateCredentials(userid, password)
    }

    return (
        <div className='flex justify-center items-center h-[90vh] w-full flex-col'>
            <h1 className='text-white font-bold text-4xl m-4'>Log into Klearvision Account</h1>
            <div className='bg-gray-900 text-gray-50 rounded-lg px-8 py-5'>
                <form 
                    onSubmit={handleSubmit}
                    className='flex items-center justify-center flex-col rounded-lg'
                >User Id
                    <input 
                        type="text"
                        className='bg-gray-700 focus: border-gray-500 focus: ring-1 focus: ring-gray-800
                        outline-none text-gray-50 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out rounded-lg'
                        placeholder='Enter userid'
                        value={userid}
                        onChange={(e) => setUserid(e.target.value)}
                    />
                Password
                    <input 
                        type="text" 
                        className='bg-gray-700 focus: border-gray-500 focus: ring-1 focus: ring-gray-800
                        outline-none text-gray-50 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out rounded-lg'
                        placeholder='Enter Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                        type='submit'
                        className='bg-blue-600 m-2 py-1 px-2 rounded'
                    >
                        Submit
                    </button>
                </form>
                {status === "loading" && <p>loading</p>}
                {status === "failed" && <p className='text-red-500'>{error}</p>}
            </div>
        </div>
    )
}

export default LoginPage
