import { makeStyles } from "@mui/styles";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const useStyles = makeStyles({
    bar: {
        display : 'flex',
        flexDirection : 'row'
    },
    logo: {
        width: '50px',
        height: '50px',
        left: 0
    },
    "nav-menu": {
        right: 0
    }
  });

const TopNavigationBar : React.FC = () => {
    const classes = useStyles();
    const {isAuthenticated} = useAuth();
    return (
        <div className={classes.bar}>
            <div>
                <img className={classes.logo} src="../logo_tp.jpg" alt="Logo"/>
            </div>
            <nav className={classes["nav-menu"]}>
                <ul style={{ display: 'flex', listStyleType: 'none', padding: 0 }}>
                    <li style={{ margin: '0 15px' }}>
                        <Link to="/">Home</Link>
                    </li>
                    <li style={{ margin: '0 15px' }}>
                        <Link to="/about">About</Link>
                    </li>
                    {!isAuthenticated &&
                        <>
                            <li style={{ margin: '0 15px' }}>
                                <Link to="/login">Login</Link>
                            </li>
                            <li style={{ margin: '0 15px' }}>
                                <Link to="/register">Register</Link>
                            </li>
                        </>
                    }
                    {isAuthenticated &&
                        <>
                            <li style={{ margin: '0 15px' }}>
                                <Link to="/profile">Profile</Link>
                            </li>
                            <li style={{ margin: '0 15px' }}>
                                <Link to="/logout">Logout</Link>
                            </li>
                        </>
                    }
                    
                    
                </ul>
            </nav>
        </div>
    )
}

export default TopNavigationBar;