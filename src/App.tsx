import React, { Suspense, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { renewToken } from './api/authAPI';
import { RootState, AppDispatch } from './app/store';
import Loading from './components/Loading';
import { TokenDetails, UserState } from './types';
import PrivateRoute from './pages/PrivateRoute';

// Lazy load your components
const HomePage = React.lazy(() => import('./pages/HomePage'));
const AboutPage = React.lazy(() => import('./pages/AboutPage'));
const NotFound = React.lazy(() => import('./pages/NotFound'));
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const LogoutPage = React.lazy(() => import('./pages/LogoutPage'));
const RegisterPage = React.lazy(() => import('./pages/RegisterPage'));
const UserProfilePage = React.lazy(() => import('./pages/UserProfilePage'));
const DevicePage = React.lazy(() => import('./pages/DevicePage'));
const StreamPage = React.lazy(() => import('./pages/StreamPage'));

function App() {

  const [userToken, setUserToken] = useState<TokenDetails|null>(null);
  const [userUUID, setUserUUID] = useState<string|null>(null);
  const [userFetched, setUserFetched] = useState<boolean>(false);

  const {isAuthenticated} = useSelector<RootState, UserState>(state => state.user)

  const dispatch = useDispatch<AppDispatch>();

  useEffect(()=>{
    if(!isAuthenticated){
      if(!userUUID) {
          setUserUUID(window.localStorage.getItem("acadomateUUID") ?? "");
      }
      if(!userToken) {
          const acadomateToken = window.localStorage.getItem("acadomateToken");
          const userToken: TokenDetails = acadomateToken ? JSON.parse(acadomateToken) : null;
          setUserToken(userToken ?? {token : ""});
      }
      if(userToken && userUUID && !userFetched) {
          const tokenExpired = userToken && userToken.expiry < Date.now()/1000;
          console.log("tokenExpired : ", tokenExpired)
          if(!tokenExpired) dispatch(renewToken(userToken.token));
          setUserFetched(true);
      }
    }
    console.log(userUUID, userToken, userFetched)
      
  },[userUUID,userToken])

  return (
      <Router>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <UserProfilePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/device"
              element={
                <PrivateRoute>
                  <DevicePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/stream"
              element={
                <PrivateRoute>
                  <StreamPage />
                </PrivateRoute>
              }
            />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/logout" element={<LogoutPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Router>
  );
}

export default App;
