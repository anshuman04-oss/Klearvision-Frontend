import {useDispatch} from 'react-redux'
import { logout } from '../../features/loginSlice'

function LogoutBtn() {

    const dispatch = useDispatch()

    const logoutHandler = () => {
        dispatch(logout())
    }

    return (
        <button
            className='inline-block px-6 py-2 duration-200 hover:bg-blue-600 rounded-full'
            onClick={logoutHandler}
        >Logout
        </button>
    )
}

export default LogoutBtn
