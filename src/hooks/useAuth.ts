import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../app/store";
import { UserState } from "../types";
import { userLogin, userLogout } from "../api/authAPI";

const useAuth = () => {
    const dispatch = useDispatch<AppDispatch>();
    const {tokenDetails, isAuthenticated, error, status} = useSelector<RootState, UserState>(state => state.user);

    const loginUser = (username: string, password: string) => {
        dispatch(userLogin(username, password));
    }

    const logoutUser = () => {
        dispatch(userLogout())
    }

    return { accessToken: tokenDetails?.token, error, status, isAuthenticated, loginUser, logoutUser }
}

export default useAuth