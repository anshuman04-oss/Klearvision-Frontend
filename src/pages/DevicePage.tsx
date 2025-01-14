import DeviceContainer from "../components/Devices/DeviceContainer";
import withBasePage from "./withBasePage";

const DevicePage : React.FC = () => {
    return(
        <div>
            <DeviceContainer />
        </div>
    );
}

export default withBasePage(DevicePage);