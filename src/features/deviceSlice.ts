import { createSlice } from "@reduxjs/toolkit";
import { Device, DeviceState } from "../types";
import { Status } from "../constants";

const initialState : DeviceState = {
    devices: {},
    status: Status.IDLE,
    error: null
}

const deviceSlice = createSlice({
    name: "device",
    initialState,
    reducers: {
        register: (state, action) => {
            const device: Device = action.payload.deviceData as Device;
            state.devices[device.deviceId] = device;
            state.status = Status.SUCCEEDED
        },
        deregister: (state, action) => {
            const device: Device = action.payload.deviceData as Device;
            Object.keys(state.devices).forEach(deviceId => {
                if(deviceId === device.deviceId) delete state.devices[deviceId];
            });
            state.status = Status.SUCCEEDED
        },
        setPlaybackToken: (state, action) => {
            const {deviceId, playBackToken, tokenExpiry} = action.payload;
            state.devices[deviceId].playBackToken = playBackToken;
            state.devices[deviceId].tokenExpiry = tokenExpiry;
            state.status = Status.SUCCEEDED
        },
        deviceError: (state, action) => {
            state.error = action.payload.errorData
            state.status = Status.FAILED
        },
        deviceStatus: (state, action) => {
            state.status = action.payload.status
        }
    }
})

export const {register, deregister, deviceError, deviceStatus, setPlaybackToken} = deviceSlice.actions;

export default deviceSlice.reducer