import { ReactElement } from "react"
import logo from '../logo.svg';
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(({
    appLogo: {
      height: '40vmin',
      pointerEvents: 'none',
      animation: '$spin infinite 20s linear', // Refers to the keyframes animation
    },
    '@media (prefers-reduced-motion: no-preference)': {
      appLogo: {
        animation: '$spin infinite 20s linear',
      },
    },
    '@keyframes spin': {
      from: {
        transform: 'rotate(0deg)',
      },
      to: {
        transform: 'rotate(360deg)',
      },
    },
}));

const Loading : React.FC = (): ReactElement => {
    const classes = useStyles();
    return (
        <div className="App">
            <h1>Loading...</h1>
            <img src={logo} className={classes.appLogo} alt="logo" />
        </div>
    )
}

export default Loading;