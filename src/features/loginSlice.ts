/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { validateUser } from "../api/authAPI";
import { Status } from "../constants";

// ToDo - Access token and expiry time should be stored in redux store.

export interface User {
    userid: string;
    password: string;
}

export interface UserState {
    users: User[];
    isAuthenticated: boolean;
    // ToDo - Create an enum for status
    status: Status;
    error: string | null;
}

const initialState = {  
    users: [{userid: "1", password: "1"}],
    isAuthenticated: false,
    status: Status.Idle,
    error: null
};

export const checkCredentials = createAsyncThunk(
    "user/checkCredentials",
    async (credentials: User, { rejectWithValue }) => {
        try {
            const response = await validateUser(credentials.userid, credentials.password);
            return response
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Validation failed");
        }
    }
);

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        addUser: (state, action: PayloadAction<User>) => {
            state.users.push(action.payload);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(checkCredentials.pending, (state) => {
                state.status = Status.Loading;
                state.error = null
            })
            .addCase(checkCredentials.fulfilled, (state) => {
                state.status = Status.Succeeded;
                state.isAuthenticated = true
            })
            .addCase(checkCredentials.rejected, (state, action) => {
                state.status = Status.Failed;
                state.error = (action.payload as string)
            })
    }
})

export const {addUser} = userSlice.actions

export default userSlice.reducer