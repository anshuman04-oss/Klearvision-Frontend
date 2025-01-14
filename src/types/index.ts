// ToDo - All models should be in types folder
// For ex, all the login related models should be in login.ts under types folder.
// Impoert and export all the types.
import { Status } from "../constants";
import React from "react";

interface User {
    userId: string;
    password: string;
}

interface UserState {
    users: User[];
    isAuthenticated: boolean;
    // ToDo - Create an enum for status
    status: Status;
    error: string | null;
}

interface DeviceState {
    devices: string[]
    status: Status
    error: string | null
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    type?: string;
    className?: string;
}

interface FormData {
    name: string
    password: string
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    options?: string []
    label?: string
    className?: string
}

export type { User, UserState, DeviceState, InputProps, FormData, SelectProps }