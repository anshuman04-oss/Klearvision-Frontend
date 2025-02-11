/* eslint-disable @typescript-eslint/no-unused-vars */
import { configureStore } from "@reduxjs/toolkit";
import loginSlice from "../features/userSlice";
import deviceReducer from "../features/deviceSlice";

const store = configureStore({
    reducer: {
        user: loginSlice,
        device: deviceReducer
    }
})

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store