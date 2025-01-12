import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../app/store";
import { checkCredentials } from "../features/loginSlice";

const UseAuth = () => {
    const dispatch = useDispatch<AppDispatch> ()
    const { isAuthenticated, status, error } = useSelector((state: RootState) => state.user);

    const validateCredentials = async (userid: string, password: string) => {
        await dispatch (checkCredentials({ userid, password }))
    }

    return {isAuthenticated, status, error, validateCredentials}
}

export default UseAuth