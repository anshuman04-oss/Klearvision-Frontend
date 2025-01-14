import React, { ReactElement } from "react";
import withBasePage from "./withBasePage";

const AboutPage : React.FC = () : ReactElement => {
    return (
        <>
            <h1>This is the About page</h1>
        </>
        
    );
}

export default withBasePage(AboutPage);