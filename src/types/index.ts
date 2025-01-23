import { UUID } from "crypto";
import { Status } from "../constants";
import React from "react";

interface User {
    userId?     : UUID | "" | undefined
    firstName   : string
    lastName    : string | undefined
    email       : string
    phone       : number | string
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
    tokenExpiry     : number | undefined
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

interface hlsURL {
    hlsURL: string
}

interface LoginFormData {
    username: string
    password: string
}

interface PrivateRouteProps {
    children: JSX.Element;
}

interface PlaybackTokenContent {
    deviceId: string
    playBackUrl: string
    playbackAccessToken: string
    expiration: number
}

interface DropdownProps {
    mainElement?: string;
    sideElements?: string[];
    onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export type { User, UserState, TokenDetails, Device, DeviceState, InputProps, FormData, SelectProps, hlsURL, LoginFormData, PrivateRouteProps, PlaybackTokenContent, DropdownProps }