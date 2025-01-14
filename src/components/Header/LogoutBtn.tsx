import useAuth from '../../hooks/useAuth'

function LogoutBtn() {

    const {logoutUser} = useAuth();

    return (
        <button
            className='inline-block px-6 py-2 duration-200 hover:bg-blue-600 rounded-full'
            onClick={() => logoutUser()}
        >Logout
        </button>
    )
}

export default LogoutBtn
