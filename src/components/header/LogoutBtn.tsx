// import { Button } from '@mui/material';
import useAuth from '../../hooks/useAuth'

function LogoutBtn() {

    const {logoutUser} = useAuth();

    return (
        <button
            className='inline-block px-6 py-2 duration-200 hover:bg-blue-600 rounded-full text-gray-50'
            // sx={{
            //     textTransform: "none", // Prevents uppercase
            //     color: "white", // Sets text color to white
            //     backgroundColor: "transparent", // Removes default blue background
            //     "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.2)" }, // Light hover effect
            //   }}
            onClick={() => logoutUser()}
        >Logout
        </button>
    )
}

export default LogoutBtn
