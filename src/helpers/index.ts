import { KVS_LOCAL_STORAGE_KEY } from "../constants";
import { TokenDetails } from "../types";

export const isTokenExpired = () : boolean => {
    const storedToken = window.localStorage.getItem(KVS_LOCAL_STORAGE_KEY)
    let parsedToken;
    try {
        if(storedToken) {
            parsedToken = JSON.parse(storedToken) as TokenDetails;
        } else return true;
    } catch (error) {
        console.error(`Error while parsing the stored Token: ${storedToken},\n`, error)
    }
    if(parsedToken && parsedToken.expiry) {
        return parsedToken.expiry <= Date.now()/1000;
    } else return true;
}