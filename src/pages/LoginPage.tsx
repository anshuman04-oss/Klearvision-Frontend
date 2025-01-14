import { Navigate } from "react-router-dom";
import withBasePage from "./withBasePage";
import LoginComponent from "../components/LoginPage/LoginComponent";
import useAuth from "../hooks/useAuth";

const LoginPage : React.FC = () => {
    const {isAuthenticated} = useAuth();
    return(
        <div>
            {!isAuthenticated && <LoginComponent />}
            {isAuthenticated && <Navigate to="/home" />}
        </div>
    );
}

export default withBasePage(LoginPage);