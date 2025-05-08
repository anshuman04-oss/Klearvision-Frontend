import Signup from "../components/signup/Signup";
import withBasePage from "./withBasePage";


const RegisterPage : React.FC = () => {
    return(
        <div>
            <Signup />
        </div>
    );
}

export default withBasePage(RegisterPage);