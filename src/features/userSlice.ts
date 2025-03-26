import { createSlice } from "@reduxjs/toolkit"
import { UserState } from "../types"
import { KVS_LOCAL_STORAGE_KEY, Status } from "../constants";

// ToDo - Access token and expiry time should be stored in redux store.

const initialState : UserState = {
    userDetails: null,
    tokenDetails: null,
    isAuthenticated: false,
    status: Status.IDLE,
    error: null
};

const userSlice = createSlice({
    name: "login",
    initialState,
    reducers: {
        login: (state, action) => {
            state.tokenDetails = action.payload.tokenData
            window.localStorage.setItem(KVS_LOCAL_STORAGE_KEY, JSON.stringify(state.tokenDetails))
            state.isAuthenticated = Boolean(state.tokenDetails && state.tokenDetails.token && state.tokenDetails.expiry > Date.now()/1000);
            state.status = Status.SUCCEEDED
        },
        logout: (state) => {
            window.localStorage.clear();
            state.userDetails = null;
            state.tokenDetails = null;
            state.isAuthenticated = false;
            state.status = Status.IDLE
        },
        fetchUserDetails: (state, action) => {
            state.userDetails = action.payload.userData;
            state.status = Status.SUCCEEDED
        },
        loginError: (state, action) => {
            state.error = action.payload.errorData
            state.status = Status.FAILED
        },
        loginStatus: (state, action) => {
            state.status = action.payload.status
        }
    }
})

export const { login, logout, fetchUserDetails, loginError, loginStatus } = userSlice.actions;

export default userSlice.reducer;