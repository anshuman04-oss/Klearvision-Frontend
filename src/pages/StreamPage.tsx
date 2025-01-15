import React, { ReactElement } from "react";
import withBasePage from "./withBasePage";
import Streamer from "../components/RTMPStreamer/Streamer";

const StreamPage : React.FC = () : ReactElement => {
    return (
        <>
            <h1>This is the Stream page</h1>
            <Streamer />
        </>
        
    );
}

export default withBasePage(StreamPage);