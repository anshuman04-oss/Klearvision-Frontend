/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
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
            const {deviceId, playBackToken} = action.payload;
            state.devices[deviceId].playBackToken = playBackToken;
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

















































// import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
// import { registerDevice, removeDevice } from "../api/deviceAPI";
// import { Status } from "../constants";
// import { DeviceState } from "../types";

// const initialState: DeviceState = {
//     devices: [],    // ToDo - this has to be map of deviceId to device object
//     status: Status.Idle,
//     error: null
// }

// export const registerDeviceAsync = createAsyncThunk(
//     "devices/register",
//     async ({ deviceId, userId, password }: { deviceId: string; userId: string; password: string }, { rejectWithValue }) => {
//         try {
//             return await registerDevice(deviceId, userId, password)
//         } catch (error) {
//             return rejectWithValue(error.response?.data?.message || "Failed to register device")
//         }
//     }
// )

// export const removeDeviceAsync = createAsyncThunk(
//     "devices/remove",
//     async (deviceId: string, { rejectWithValue }) => {
//         try {
//             return await removeDevice(deviceId)
//         } catch (error) {
//             return rejectWithValue(error.response?.data?.message || "Failed to remove device")
//         }
//     }
// )

// const deviceSlice = createSlice({
//     name: "devices",
//     initialState,
//     reducers: {},
//     extraReducers: (builder) => {
//         builder
//             .addCase(registerDeviceAsync.pending, (state) => {
//                 state.status = Status.Loading
//             })
//             .addCase(registerDeviceAsync.fulfilled, (state, action: PayloadAction<DeviceState>) => {
//                 state.status = Status.Succeeded
//                 const {deviceId} = action.payload;
//                 state.devices[deviceId] = action.payload
//                 state.devices.push(action.payload)
//             })
//             .addCase(registerDeviceAsync.rejected, (state, action) => {
//                 state.status = Status.Failed
//                 state.error = action.payload as string
//             })  
//             .addCase(removeDeviceAsync.pending, (state) => {
//                 state.status = Status.Loading
//             })
//             .addCase(removeDeviceAsync.fulfilled, (state, action: PayloadAction<string>) => {
//                 state.status = Status.Succeeded
//                 state.devices = state.devices.filter((deviceId) => deviceId != action.payload)
//             })
//             .addCase(removeDeviceAsync.rejected, (state, action) => {
//                 state.status = Status.Failed
//                 state.error = action.payload as string
//             })
//     }
// })

// export default deviceSlice.reducer;