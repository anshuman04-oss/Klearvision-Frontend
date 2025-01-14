import React, { useState } from "react"
// import useDevice from "../../hooks/useDevice"

function DevicePage() {

    const [deviceId, setDeviceId] = useState("")
    const [userId, setUserId] = useState("")
    const [password, setPassword] = useState("")
    const { devices, status, error, registerDevice, removeDevice } = useDevice();

    const handleRegister = () => {
        registerDevice(deviceId, userId, password)
    }

    const handleRemove = (deviceId: string) => {
        removeDevice(deviceId)
    }

    // ToDo - A single page should not contain all the logicsm, but only other components
    // One component should handle one api calls

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
                    placeholder="Device ID"
                    value={deviceId}
                    onChange={(e) => setDeviceId(e.target.value)}
                    className="bg-gray-700 mb-2 text-gray-50 py-1 px-3 rounded-lg"
                />
                <input
                    type="text"
                    placeholder="User ID"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    className="bg-gray-700 mb-2 text-gray-50 py-1 px-3 rounded-lg"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-gray-700 mb-2 text-gray-50 py-1 px-3 rounded-lg"
                />
                <button onClick={handleRegister} className="bg-blue-600 py-1 px-2 rounded">
                    Register
                </button>
                {status === "loading" && <p>Loading...</p>}
                {error && <p className="text-red-500">{error}</p>}
            </div>
            <div className="bg-gray-900 text-gray-50 rounded-lg px-8 py-5 mt-4 w-2/5 ml-10">
                <h2 className="text-xl mb-4">Registered Devices</h2>
                <ul>
                    {devices.map((deviceId) => (
                        <li key={deviceId} className="flex justify-between items-center mb-2 bg-gray-800 text-gray-50">
                            <span>{deviceId}</span>
                            <button onClick={() => handleRemove(deviceId)} className="bg-red-600 py-1 px-2 rounded text-white">
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

export default DevicePage
