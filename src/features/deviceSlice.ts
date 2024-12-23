/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { registerDevice, removeDevice } from "../api/deviceAPI";

interface DeviceState {
    devices: string[]
    status: "idle" | "loading" | "succeded" | "failed"
    error: string | null
}

const initialState: DeviceState = {
    devices: [],
    status: "idle",
    error: null
}

export const registerDeviceAsync = createAsyncThunk(
    "devices/register",
    async ({ deviceId, userId, password }: { deviceId: string; userId: string; password: string }, { rejectWithValue }) => {
        try {
            return await registerDevice(deviceId, userId, password)
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to register device")
        }
    }
)

export const removeDeviceAsync = createAsyncThunk(
    "devices/remove",
    async (deviceId: string, { rejectWithValue }) => {
        try {
            return await removeDevice(deviceId)
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to remove device")
        }
    }
)

const deviceSlice = createSlice({
    name: "devices",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(registerDeviceAsync.pending, (state) => {
                state.status = "loading"
            })
            .addCase(registerDeviceAsync.fulfilled, (state, action: PayloadAction<string>) => {
                state.status = "succeded"
                state.devices.push(action.payload)
            })
            .addCase(registerDeviceAsync.rejected, (state, action) => {
                state.status = "failed"
                state.error = action.payload as string
            })  
            .addCase(removeDeviceAsync.pending, (state) => {
                state.status = "loading"
            })
            .addCase(removeDeviceAsync.fulfilled, (state, action: PayloadAction<string>) => {
                state.status = "succeded"
                state.devices = state.devices.filter((deviceId) => deviceId != action.payload)
            })
            .addCase(removeDeviceAsync.rejected, (state, action) => {
                state.status = "failed"
                state.error = action.payload as string
            })
    }
})

export default deviceSlice.reducer;