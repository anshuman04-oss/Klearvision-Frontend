/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from "axios";
import { Status, API_BASE_URL } from "../constants";
import { AppDispatch } from "../app/store";
import { fetchUserDetails, login, loginError, loginStatus, logout } from "../features/loginSlice";
import { TokenDetails, User } from "../types";

//TODO - Implement the fetchUser dispatch function - Done
export const fetchUser = (accessToken : string) => async (dispatch: AppDispatch) => {
    const url = `${API_BASE_URL}/v1/`
  try {
    dispatch(loginStatus({status : Status.LOADING}));
    
    const response = await axios.get(url, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        }
    });
    const data = await response.data as User;
    
    dispatch(fetchUserDetails({userData: data}));

  } catch (error) {
    console.log(error)
    dispatch(loginError({errorData : error}))
  }
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
interface RegisterUserRequest {
  firstName: string;
  lastName: string | undefined;
  mail: string;
  phNo: string;
  password: string;
}
export const registerUser = (user : User) => async () => {
  if(!user.password) {
    alert("Password is required");
    return;
  } else if(!user.email) {
    alert("Email is required");
    return;
  } else if(!user.phone) {
    alert("Phone number is required");
    return;
  } else if(!user.firstName) {
    alert("First name is required");
    return;
  }
  const url = `${API_BASE_URL}/v1/register`

  const reqPayload : RegisterUserRequest = {
    firstName: user.firstName,
    lastName: user.lastName,
    mail: user.email,
    phNo: String(user.phone),
    password: user.password
  }

  try {
    const response = await axios.post(url, reqPayload, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    console.log(response.data)
    if(response.status === 200) {
      alert("User registered successfully");
    } else {
      alert("User registration failed");
    }
  } catch (error) {
    console.error("Error while registering ", error)
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const userLogin = (username : string, password: string) => async (dispatch: AppDispatch) => {
    const url = `${API_BASE_URL}/v1/login`
  try {
    dispatch(loginStatus({status: Status.LOADING}));
    const response = await axios.post(url,{
        loginId : username,
        password
    }, {
        headers: {
          'Content-Type': 'application/json',
        }
    });
    
    const data = await response.data as any;
    const tokenData: TokenDetails = {
      token: data.access_token,
      expiry: Date.now()/1000 + parseInt(data.expires_in.replace(/\D/g, ''), 10),
      type: data.token_type
    }
    dispatch(login({tokenData}));

  } catch (error) {
    console.log(error)
    dispatch(loginError({errorData: error}))
  }
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const renewToken = (token: string) => async (dispatch: AppDispatch) => {
  const url = `${API_BASE_URL}/v1/auth/renewAccessToken`
  try {
    dispatch(loginStatus({status: Status.LOADING}));
    const response = await axios.get(url,{
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
    });
    
    const data = await response.data as any;
    const tokenData: TokenDetails = {
      token: data.access_token,
      expiry: Date.now()/1000 + parseInt(data.expires_in.replace(/\D/g, ''), 10),
      type: data.token_type
    }
    dispatch(login({tokenData}));

  } catch (error) {
    console.log(error)
    dispatch(loginError({errorData: error}))
  }
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const userLogout = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(loginStatus({status: Status.LOADING}));
    dispatch(logout());

  } catch (error) {
    console.log(error)
    dispatch(loginError({errorData: error}))
  }
};

// ToDo - Camel case for all the var names - last
// ToDo - If the user directly comes to some other page like stream, redirect to login.
// If already authorized, login route will always redirect to home.






































// import axios from "axios";
// import API_BASE_URL from "../constants/index";

// const api = axios.create({
//     baseURL: API_BASE_URL,
//     headers: {
//         "Content-Type": "application/json",
//     }
// })

// export default api;