/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Container, LogoutBtn } from "../../constants";
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux'
import { useNavigate } from "react-router-dom";

function Header() {

    const authStatus = useSelector((state: { status: boolean; }) => state.status)
    const navigate = useNavigate()

    const navItems = [
        {
            name: "name",
            slug: "/",
            active: true
        },
        {
            name: "login",
            slug: "/login",
            active: !authStatus
        },
        {
            name: "Signup",
            slug: "/signup",
            active: !authStatus
        },
        {
            name: "Devices",
            slug: "/devices",
            active: authStatus
        },
        {
            name: "All Products",
            slug: "/all-products",
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
                                        className="inline-block px-6 py-2 duration-200 hover:bg-blue-500 rounded-full"
                                    >
                                        {item.name}
                                    </button>
                                </li>
                            ) : null
                        )}
                        {authStatus && (
                            <li>
                                <LogoutBtn />
                            </li>
                        )}
                    </ul>
                </nav>
            </Container>
        </header>
    )
}

export default Header