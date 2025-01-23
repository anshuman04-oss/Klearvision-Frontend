import RegisterDevice from "./RegisterDevice";
import DeviceList from "./DeviceList";

function DeviceContainer() {

    return (
        <>
        <div className="py-10 relative">
        <div className="flex items-center justify-center my-10">
            <h1 className="text-white font-bold text-6xl items-center">Devices</h1>
        </div>
        <div className="flex items-center py-0 px-10 ml-14 fixed my-10 w-full">
            <RegisterDevice />
            <DeviceList />
        </div>
        </div>
        </>
    );
}

export default DeviceContainer