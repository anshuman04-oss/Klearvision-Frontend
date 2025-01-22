const API_BASE_URL = 'https://8xk6jj6h71.execute-api.ap-south-1.amazonaws.com/api'

import Container from "../container/Container";
import LogoutBtn from "../components/Header/LogoutBtn";
import Button from "../components/Button";
import Input from "../components/Input";

// ToDo - Convert to all caps for status
export enum Status {
    IDLE = "IDLE",
    LOADING = "LOADING",
    SUCCEEDED = "SUCCEEDED",
    FAILED = "FAILED"
}

export const KVS_LOCAL_STORAGE_KEY = "KVSToken";
export const STREAM_URL = "<streamURL>"

export { Container, LogoutBtn, Button, Input }

export default API_BASE_URL;