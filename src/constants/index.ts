const API_BASE_URL = 'https://8xk6jj6h71.execute-api.ap-south-1.amazonaws.com/api'

import Container from "../container/Container";
import LogoutBtn from "../components/header/LogoutBtn";
import Button from "../components/Button";
import Input from "../components/Input";

export enum Status {
    IDLE = "IDLE",
    LOADING = "LOADING",
    SUCCEEDED = "SUCCEEDED",
    FAILED = "FAILED"
}

export const KVS_LOCAL_STORAGE_KEY = "KVSToken";
export const STREAM_URL = "rtmp://VideoProcessingServerASG-NLB-49b63e78c9aa7744.elb.ap-south-1.amazonaws.com:443/live"

export { Container, LogoutBtn, Button, Input }

export const PLAYBACK_URL = 'https://9f18fad97252.ap-south-1.playback.live-video.net/api/video/v1/ap-south-1.495846082945.channel.7toMdurmBg5A.m3u8'

export default API_BASE_URL;