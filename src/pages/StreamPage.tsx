import React, { ReactElement } from "react";
import withBasePage from "./withBasePage";

const StreamPage : React.FC = () : ReactElement => {
    return (
        <>
            <h1>This is the Stream page</h1>
        </>
        
    );
}

export default withBasePage(StreamPage);