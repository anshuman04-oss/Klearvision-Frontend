/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from "axios";
import API_BASE_URL, { Status } from "../constants";
import { AppDispatch } from "../app/store";
import { fetchUserDetails, login, loginError, loginStatus, logout } from "../features/loginSlice";
import { TokenDetails, User } from "../types";

//TODO - Implement the fetchUser dispatch function
export const fetchUser = (accessToken : string) => async (dispatch: AppDispatch) => {
    const url = `${API_BASE_URL}/v1/device`
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

export const registerUser = (user : User) => async (dispatch : AppDispatch) => {
  //TODO - Need to implement
  const url = `${API_BASE_URL}/v1/register`
  try {
    const response = await axios.post(url, user)
    
  } catch (error) {
    console.log(error)
  }
}

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
    
    const data = await response.data as TokenDetails;

    dispatch(login({tokenData: {token : data.token, expiry: Date.now()/1000 + data.expiry, type: data.type}}));

  } catch (error) {
    console.log(error)
    dispatch(loginError({errorData: error}))
  }
};

export const renewToken = (token: string) => async (dispatch: AppDispatch) => {
//   const url = `${API_BASE_URL}/renew`
  try {
    // dispatch(setUserLoading(true));
    // const response = await fetch(url, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({uuid, token})
    // });
    
    // const data = await response.json() as UserToken;

    // dispatch(fetchUserSuccess(data.user));
    // dispatch(userLoginSuccess({token : data.token, expiry: Date.now()/1000 + 3600}));

  } catch (error) {
    console.log(error)
    dispatch(loginError({errorData: error}))
  }
};

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





// Output for device details -> 
// "f8296422-735d-40c3-8616-36b02270a522": {
//         "device_name": "allCheck",
//         "kvs_stream_key": "sk_7yh0NALJDURSsPhsf8s33s_1e0015f6f90f011addb37c00b072f783b184f93ae65ec1207003fcffb9ed6aa0_y7VfsKZ.qYUkbhONutmf295NMus5Ix",
//         "ivs_stream_key": "sk_ap-south-1_bGW7UbFdOEa8_emMR8wd0yxVG8KsCwmd0Vb2aBRv0fz",
//         "ivs_channel_arn": "arn:aws:ivs:ap-south-1:495846082945:channel/uFj1cNdVQebg",
//         "ivs_name": "allCheck_003fb836-24e2-48aa-b9df-97573fb49727",
//         "ivs_ingest_point": "9f18fad97252.global-contribute.live-video.net",
//         "ivs_playback_url": "https://9f18fad97252.ap-south-1.playback.live-video.net/api/video/v1/ap-south-1.495846082945.channel.uFj1cNdVQebg.m3u8",
//         "ivs_authorised": 1,
//         "created_at": "2025-01-02T08:05:45.000Z"
//     }






































// import axios from "axios";
// import API_BASE_URL from "../constants/index";

// const api = axios.create({
//     baseURL: API_BASE_URL,
//     headers: {
//         "Content-Type": "application/json",
//     }
// })

// export default api;