/* eslint-disable @typescript-eslint/no-unused-vars */
import { configureStore } from "@reduxjs/toolkit";
import { userSlice } from "../features/loginSlice";
import deviceReducer from "../features/deviceSlice";

export const store = configureStore({
    reducer: {
        user: userSlice.reducer,
        device: deviceReducer
    }
})

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store