/* eslint-disable @typescript-eslint/no-unused-vars */
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../app/store";
import { Device, DeviceState, UserState } from "../types";
import { logout } from "../features/loginSlice";
import { useEffect } from "react";
import { fetchDevices, registerDevice, removeDevice } from "../api/deviceAPI";
import { UUID } from "crypto";

const useDevice = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { devices, status, error } = useSelector<RootState, DeviceState>((state: RootState) => state.device);
    const {tokenDetails} = useSelector<RootState, UserState>(state => state.user);
    const deviceList : Device[] = []
    if(devices) Object.keys(devices).forEach((deviceId: string) =>{
        deviceList.push(devices[deviceId])
    })

    let accessToken = "";
    
    useEffect(() => {
		if(tokenDetails && tokenDetails.expiry > Date.now()/1000) {
            accessToken = tokenDetails.token;
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
        dispatch(registerDevice(deviceName, accessToken));
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