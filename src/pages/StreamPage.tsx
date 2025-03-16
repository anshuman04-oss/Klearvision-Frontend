import React, { ReactElement } from "react";
import withBasePage from "./withBasePage";
import WebcamStreamer from "../components/RTMPStreamer/WebcamStreamer";

const StreamPage: React.FC = (): ReactElement => {
    return (
        <div className="stream-page">
            <h1>Video Streaming</h1>
            <WebcamStreamer />
        </div>
    );
};

export default withBasePage(StreamPage);