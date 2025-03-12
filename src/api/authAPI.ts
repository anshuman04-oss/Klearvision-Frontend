import axios from "axios";
import API_BASE_URL, { Status } from "../constants";
import { AppDispatch } from "../app/store";
import { fetchUserDetails, login, loginError, loginStatus, logout } from "../features/userSlice";
import { TokenDetails, User, SignUpFormData, UserAuthCheck } from "../types";

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

export const registerUser = (user : SignUpFormData) => async (dispatch : AppDispatch) => {
  //TODO - Need to implement  - Done 
  const url = `${API_BASE_URL}/v1/device/register`

  try {
    const response = await axios.post(url, user, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    console.log(response.data)
    if(response.status === 200) alert("User registered successfully");
    dispatch(login({ email: user.email, password: user.password }));   // Sent to login page after successful registration
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
    
    const data = await response.data as UserAuthCheck;
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
    
    const data = await response.data as UserAuthCheck;
    console.log(data)
    console.log(typeof data)
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




















