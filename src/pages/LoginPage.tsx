import { Navigate } from "react-router-dom";
import withBasePage from "./withBasePage";
import LoginComponent from "../components/loginPage/LoginComponent";
import useAuth from "../hooks/useAuth";

const LoginPage : React.FC = () => {
    const {isAuthenticated} = useAuth();
    return(
        <div>
            {!isAuthenticated && <LoginComponent />}
            {isAuthenticated && <Navigate to="/home" />}
            {/* <LoginComponent/> */}
        </div>
    );
}

export default withBasePage(LoginPage);