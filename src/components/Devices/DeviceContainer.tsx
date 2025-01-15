import { useState } from "react"
import useDevice from "../../hooks/useDevice";
import { UUID } from "crypto";
import { Status } from "../../constants";
import { Device } from "../../types";
// import useDevice from "../../hooks/useDevice"

function DeviceContainer() {

    const [device, setDevice] = useState<Device|undefined>(undefined)
    const [deviceName, setDeviceName] = useState("")
    const { deviceList, status, error, deviceRegister, deviceRemove } = useDevice();

    const handleRegister = () => {
        deviceRegister(deviceName)
    }

    const handleRemove = (deviceId: UUID) => {
        deviceRemove(deviceId)
    }

    // ToDo - A single page should not contain all the logicsm, but only other components
    // One component should handle one api calls
    console.log(`Selected Device = ${device}`)

    return (
        <>
        <div className="py-10">
        <div className="flex items-center justify-center my-10">
            <h1 className="text-white font-bold text-6xl items-center">Devices</h1>
        </div>
        <div className="flex items-center py-0 px-10 ml-14 fixed my-10 w-full">
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
                {status === Status.LOADING && <p>Loading...</p>}
                {error && <p className="text-red-500">{error}</p>}
            </div>
            <div className="bg-gray-900 text-gray-50 rounded-lg px-8 py-5 mt-4 w-2/5 ml-10">
                <h2 className="text-xl mb-4">Registered Devices</h2>
                <ul>
                    {deviceList.map((device : Device) => (
                        <li key={device.deviceId} onClick={() => setDevice(device)} className="flex justify-between items-center mb-2 bg-gray-800 text-gray-50">
                            <span>{device.deviceId}</span>
                            <span>{device.deviceName}</span>
                            <button onClick={() => handleRemove(device.deviceId)} className="bg-red-600 py-1 px-2 rounded text-white">
                                Remove
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
        </div>
        </>
    );
}

export default DeviceContainer
