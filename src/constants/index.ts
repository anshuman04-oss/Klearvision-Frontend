const API_BASE_URL = 'https://8xk6jj6h71.execute-api.ap-south-1.amazonaws.com/api'

// ToDo - Convert to all caps for status
export enum Status {
    Idle = "idle",
    Loading = "loading",
    Succeeded = "succeeded",
    Failed = "failed"
}

export default API_BASE_URL;