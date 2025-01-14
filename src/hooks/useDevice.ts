// /* eslint-disable @typescript-eslint/no-unused-vars */
// import { useDispatch, useSelector } from "react-redux";
// import { AppDispatch, RootState } from "../app/store";
// import { registerDeviceAsync, removeDeviceAsync } from "../features/deviceSlice";

// const useDevice = () => {
//     const dispatch = useDispatch<AppDispatch>();
//     const { devices, status, error } = useSelector((state: RootState) => state.device);

//     const registerDevice = (deviceId: string, userId: string, password: string) => {
//         dispatch(registerDeviceAsync({ deviceId, userId, password }))
//     }

//     const removeDevice = (deviceId: string) => {
//         dispatch(removeDeviceAsync(deviceId))
//     }

//     return { devices, error, status, registerDevice, removeDevice }
// }

// export default useDevice