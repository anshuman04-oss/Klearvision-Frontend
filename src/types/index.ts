// ToDo - All models should be in types folder
// For ex, all the login related models should be in login.ts under types folder.
// Impoert and export all the types.
import { UUID } from "crypto";
import { Status } from "../constants";
import React from "react";

interface User {
    userId?     : UUID | "" | undefined
    firstName   : string
    lastName    : string | undefined
    phone       : number | string
    email       : string
    password    : string | undefined
}

interface TokenDetails {
    token   : string
    expiry  : number
    type    : string
}

interface UserState {
    userDetails     : null | User
    tokenDetails    : null | TokenDetails
    isAuthenticated : boolean
    status          : Status;
    error           : null | string
}

interface Device {
    deviceId        : UUID
    streamKey       : string
    deviceName      : string | undefined
    playBackUrl     : string
    playBackToken   : string | undefined
}

interface DeviceState {
    devices: { [key: string]: Device }
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

export type { User, UserState, TokenDetails, Device, DeviceState, InputProps, FormData, SelectProps }