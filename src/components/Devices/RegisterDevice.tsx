import { ReactElement, useState } from "react";
import useDevice from "../../hooks/useDevice";
import { Device } from "../../types";
import { Status } from "../../constants";
import Loading from "../Loading";

const RegisterDevice : React.FC<{}> = () : ReactElement => {

    const [deviceName, setDeviceName] = useState("")
    const { deviceList, status, error, deviceRegister } = useDevice();

    const handleRegister = () => {
        if(!deviceName) {
            window.alert("Device Name is Empty!!!")
            return;
        }
        if(deviceList.findIndex((device: Device) => device.deviceName === deviceName) !== -1) {
            window.alert("Device Name already Exists!!!")
            return;
        }
        deviceRegister(deviceName)
    }

    return (
        <div className="bg-gray-900 text-gray-50 rounded-lg px-8 py-5 flex flex-col w-2/5 mr-10">
            <h2 className="text-xl mb-4">Register a Device</h2>
            <input
                type="text"
                placeholder="Device Name"
                value={deviceName}
                onChange={(e) => setDeviceName(e.target.value)}
                className="bg-gray-700 mb-2 text-gray-50 py-1 px-3 rounded-lg"
            />
            <button onClick={handleRegister} className="bg-blue-600 py-1 px-2 rounded">
                Register
            </button>
            {status === Status.LOADING && <Loading />}
            {error && <p className="text-red-500">{error}</p>}
        </div>
    )
}

export default RegisterDevice;