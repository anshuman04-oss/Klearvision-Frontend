/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit"
// import { validateUser } from "../api/authAPI";
// import { Status } from "../constants";
// import { User, UserState } from "../types";

// ToDo - Access token and expiry time should be stored in redux store.

const initialState = {  
    status: false,
    userData: null
};

const loginSlice = createSlice({
    name: "login",
    initialState,
    reducers: {
        login: (state, action) => {
            state.status = true
            state.userData = action.payload.userData;
        },
        logout: (state) => {
            state.status = false
            state.userData = null
        }
    }
})

export const { login, logout } = loginSlice.actions;

export default loginSlice.reducer;






































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