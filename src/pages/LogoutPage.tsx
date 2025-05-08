import { Navigate } from "react-router-dom";
import Loading from "../components/Loading";
import useAuth from "../hooks/useAuth";
import { Status } from "../constants";

const LogoutPage : React.FC = () => {
    const {status, isAuthenticated, logoutUser} = useAuth();
    if(isAuthenticated) logoutUser();
    
    return (
        <>
            {status === Status.LOADING  && <Loading />}
            {!isAuthenticated && <Navigate to="/home" />}
        </>
    )
}

export default LogoutPage;