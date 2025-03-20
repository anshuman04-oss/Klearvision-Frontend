import { ReactElement } from "react";
import "../App.css";
import withBasePage from "./withBasePage";
import Home from "../components/homePage/Home";

const HomePage : React.FC = (): ReactElement => {
    return (
        <div className="App">
            <Home />
        </div>
    )
}

export default withBasePage(HomePage);