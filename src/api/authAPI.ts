import axios from "axios";
import API_BASE_URL from "../constants";

export const validateUser = async (userId: string, password: string) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/v1/login`, {
            userId,
            password
        });
        console.log(response.data.access_token)   
        console.log(response.data.expires_in)   
        return response.data;
    } catch(error) {
        console.error("API Error: ", error)
        throw error;
    }
}




































// import axios from "axios";
// import API_BASE_URL from "../constants/index";

// const api = axios.create({
//     baseURL: API_BASE_URL,
//     headers: {
//         "Content-Type": "application/json",
//     }
// })

// export default api;