/* eslint-disable @typescript-eslint/no-unused-vars */
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form"
import { Button, Input, Status } from "../../constants";
import useAuth from "../../hooks/useAuth";
import { User } from "../../types";
import Loading from "../Loading";

type SignUpFormData = {
    firstName   : string
    lastName    : string | undefined
    email       : number | string
    phone       : string
    password    : string | undefined
}

export default function Signup() {
    const {error, status, signUpUser} = useAuth();
    const { register, handleSubmit } = useForm<SignUpFormData>()

    const onSubmit = (data: SignUpFormData) => {
        const user = data as User;
        signUpUser(user);
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
                                required: false
                            })
                        }
                    />
                Email Id
                    <Input 
                        label='email'
                        className='bg-gray-700 focus: border-gray-500 focus: ring-1 focus: ring-gray-800
                        outline-none text-gray-50 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out rounded-lg'
                        placeholder='Enter your email id'
                        // value={userid}
                        // onChange={(e) => setUserid(e.target.value)}
                        {
                            ...register("email", {
                                required: true
                            })
                        }
                    />
                Phone Number
                    <Input 
                        label='phone'
                        className='bg-gray-700 focus: border-gray-500 focus: ring-1 focus: ring-gray-800
                        outline-none text-gray-50 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out rounded-lg'
                        placeholder='Enter your email id'
                        // value={userid}
                        // onChange={(e) => setUserid(e.target.value)}
                        {
                            ...register("phone", {
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
                {status === Status.LOADING && <Loading />}
                {status === Status.FAILED && <p className='text-red-500'>{error}</p>}
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