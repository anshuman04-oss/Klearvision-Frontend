import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { validateUser } from "../api/authAPI";

interface User {
    userid: string;
    password: string;
}

interface UserState {
    users: User[];
    isAuthenticated: boolean;
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
}

const initialState = {
    users: [{userid: "1", password: "1"}],
    isAuthenticated: false,
    status: "idle",
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
                state.status = "loading"
                state.error = null
            })
            .addCase(checkCredentials.fulfilled, (state) => {
                state.status = "succeded"
                state.isAuthenticated = true
            })
            .addCase(checkCredentials.rejected, (state, action) => {
                state.status = "failed"
                state.error = (action.payload as string)
            })
    }
})

export const {addUser} = userSlice.actions

export default userSlice.reducer