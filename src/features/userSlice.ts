/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
            console.log("setting kvsToken", state.tokenDetails, action.payload)
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






































// export const checkCredentials = createAsyncThunk(
//     "user/checkCredentials",
//     async (credentials: User, { rejectWithValue }) => {
//         try {
//             const response = await validateUser(credentials.userid, credentials.password);
//             return response
//         } catch (error: any) {
//             return rejectWithValue(error.response?.data?.message || "Validation failed");
//         }
//     }
// );

// export const userSlice = createSlice({
//     name: "user",
//     initialState,
//     reducers: {
//         addUser: (state, action: PayloadAction<User>) => {
//             state.users.push(action.payload);
//         }
//     },
//     extraReducers: (builder) => {
//         builder
//             .addCase(checkCredentials.pending, (state) => {
//                 state.status = Status.Loading;
//                 state.error = null
//             })
//             .addCase(checkCredentials.fulfilled, (state) => {
//                 state.status = Status.Succeeded;
//                 state.isAuthenticated = true
//             })
//             .addCase(checkCredentials.rejected, (state, action) => {
//                 state.status = Status.Failed;
//                 state.error = (action.payload as string)
//             })
//     }
// })

// export const {addUser} = userSlice.actions

// export default userSlice.reducer