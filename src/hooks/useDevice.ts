/* eslint-disable @typescript-eslint/no-unused-vars */
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../app/store";
import { Device, DeviceState, UserState } from "../types";
import { logout } from "../features/loginSlice";
import { useEffect, useState } from "react";
import { fetchDevices, registerDevice, removeDevice } from "../api/deviceAPI";
import { UUID } from "crypto";

// TODO - Access token should be handled here.

const useDevice = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { devices, status, error } = useSelector<RootState, DeviceState>((state: RootState) => state.device);
    const {tokenDetails} = useSelector<RootState, UserState>(state => state.user);
    const deviceList : Device[] = []
    if(devices) Object.keys(devices).forEach((deviceId: string) =>{
        deviceList.push(devices[deviceId])
    })
    const [accessToken, setAccessToken] = useState<string | undefined>(undefined);
    
    useEffect(() => {
		if(tokenDetails && tokenDetails.expiry > Date.now()/1000) {
            setAccessToken(tokenDetails.token);
        } else {
            dispatch(logout());
        }
	}, [])

    useEffect(() => {
		if(accessToken) {
            deviceFetch();
        }
	}, [accessToken])
    
    const deviceRegister = (deviceName: string) => {
        if(accessToken) {
            dispatch(registerDevice(deviceName, accessToken));
        } else {
            console.log("No access token found");
        }
    }

    const deviceFetch = () => {
        dispatch(fetchDevices(accessToken));
    }

    const deviceRemove = (deviceId: UUID) => {
        dispatch(removeDevice(deviceId, accessToken))
    }

    return { devices, deviceList, error, status, deviceRegister, deviceRemove, deviceFetch }
}

export default useDevice