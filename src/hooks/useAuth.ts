import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../app/store";
import { UserState, User } from "../types";
import { renewToken, userLogin, userLogout } from "../api/authAPI";

const useAuth = () => {
    const dispatch = useDispatch<AppDispatch>();
    const {tokenDetails, isAuthenticated, error, status} = useSelector<RootState, UserState>(state => state.user);

    const loginUser = (username: string, password: string) => {
        dispatch(userLogin(username, password));
    }

    const logoutUser = () => {
        dispatch(userLogout())
    }

    const tokenRenew = (token : string | undefined) => {
        if(token) {
            dispatch(renewToken(token));
        } else if(tokenDetails?.token) {
            dispatch(renewToken(tokenDetails?.token));
        }
    }

    return { accessToken: tokenDetails?.token, error, status, isAuthenticated, loginUser, logoutUser, tokenRenew }
}

export default useAuth