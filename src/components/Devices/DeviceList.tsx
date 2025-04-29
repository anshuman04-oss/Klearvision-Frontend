import { ReactElement, useState } from "react";
import useDevice from "../../hooks/useDevice";
import { Device } from "../../types";
import { Status, STREAM_URL } from "../../constants";
import Loading from "../Loading";
import { UUID } from "crypto";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Tooltip } from "@mui/material";

const DeviceList : React.FC<object> = () : ReactElement => {
    const [selectedDevice, setDevice] = useState<Device|undefined>(undefined)
    const { deviceList, status, error, deviceRemove } = useDevice();
    const navigate = useNavigate();

    const handleRemove = (deviceId: UUID) => {
        deviceRemove(deviceId)
    }

    const handleStream = (deviceId: UUID) => {
        //TODO-handle Stream click
        navigate(`/player/${deviceId}`)
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert("Copied to clipboard");
    }

    console.log(`Selected Device = ${selectedDevice}`)

    return (
        <div className="bg-gray-900 text-gray-50 rounded-lg px-8 py-5 mt-4 w-2/5 ml-10">
            <h2 className="text-xl mb-4">Registered Devices</h2>
            <ul>
                {deviceList.map((device : Device) => (
                    <li key={device.deviceId} onClick={() => setDevice(device)} className="flex justify-between items-center mb-2 bg-gray-800 text-gray-50">
                        {/* <span>Device Id: {device.deviceId}</span> */}
                        {/* <span>Device Name: {device.deviceName}</span> */}
                        <span className="font-bold">{device.deviceName}</span>
                        {selectedDevice?.deviceId === device.deviceId &&
                        <div>
                            <div>
                                  <div className="flex items-center justify-between bg-gray-800 p-2 rounded-lg">
                                    <Tooltip title={selectedDevice.deviceId}>
                                    <span className="truncate max-w-[150px] text-white">Device Id</span>
                                    </Tooltip>
                                    <Button 
                                    variant="contained" 
                                    color="primary" 
                                    onClick={() => copyToClipboard(selectedDevice.deviceId)}
                                    >
                                    <ContentCopyIcon fontSize="small" />
                                    </Button>
                                </div>
                                {/* <span>streamKey: {device.streamKey}</span> */}
                            </div>

                            <div className="flex items-center justify-between bg-gray-800 p-2 rounded-lg">
                                <Tooltip title={device.streamKey}>
                                <span className="truncate max-w-[150px] text-white">streamKey</span>
                                </Tooltip>
                                <Button 
                                variant="contained" 
                                color="primary" 
                                onClick={() => copyToClipboard(device.streamKey)}
                                >
                                <ContentCopyIcon fontSize="small" />
                                </Button>
                            </div>
                        </div>
                        }
                        <div>
                            <Button variant="contained" onClick={() => handleStream(device.deviceId)}>Stream</Button>
                            <Button onClick={() => handleRemove(device.deviceId)} variant="contained" color="error" className="py-1 px-2 rounded text-white">
                                Remove
                            </Button>
                        </div>
                    </li>
                ))}
            </ul>

            {status === Status.LOADING && <Loading />}
            {error && <p className="text-red-500">{error}</p>}
        </div>
    )
}

export default DeviceList;