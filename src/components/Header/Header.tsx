import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { Button, Container } from "@mui/material";

function Header() {

    const {isAuthenticated : authStatus, logoutUser} = useAuth();
    const navigate = useNavigate()

    const navItems = [
        {
            name: "Home",
            slug: "/home",
            active: true
        },
        {
            name: "About",
            slug: "/about",
            active: true
        },
        {
            name: "Login",
            slug: "/login",
            active: !authStatus
        },
        {
            name: "Signup",
            slug: "/signup",
            active: !authStatus
        },
        {
            name: "Profile",
            slug: "/profile",
            active: authStatus
        },
        {
            name: "Devices",
            slug: "/device",
            active: authStatus
        },
        {
            name: "Stream",
            slug: "/stream",
            active: authStatus
        },
        {
            name: "Detection",
            slug: "/detection",
            active: authStatus
        }
    ]

    return(
        <header className="py-3 shadow bg-gray-900">
            <Container>
                <nav>
                    <div className="mr-4">
                        <Link to="/">

                        </Link>
                    </div>
                    <ul className='flex ml-auto'>
                        {navItems.map((item) =>
                            item.active ? (
                                <li key={item.name}>
                                    <button
                                        onClick={() => navigate(item.slug)}
                                        className="inline-block px-6 py-2 duration-200 hover:bg-blue-500 rounded-full text-gray-50"
                                    >
                                        {item.name}
                                    </button>
                                </li>
                            ) : null
                        )}
                        {authStatus && (
                            <li>
                                <Button
                                    className='inline-block px-6 py-2 duration-200 hover:bg-blue-600 rounded-full text-gray-50'
                                    onClick={() => logoutUser()}
                                >Logout
                                </Button>
                            </li>
                        )}
                    </ul>
                </nav>
            </Container>
        </header>
    )
}

export default Header