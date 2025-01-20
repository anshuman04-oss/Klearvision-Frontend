import React, { Suspense, useEffect, useState } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Loading from './components/Loading';
import { TokenDetails } from './types';
import PrivateRoute from './pages/PrivateRoute';
import useAuth from './hooks/useAuth';
import { KVS_LOCAL_STORAGE_KEY } from './constants';

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
const HlsPlayer = React.lazy(() => import('./pages/HlsPlayer'));

function App() {

  const [userToken, setUserToken] = useState<TokenDetails|null>(null);
  const [newTokenFetched, setNewTokenFetched] = useState<boolean>(false);

  const {isAuthenticated, tokenRenew} = useAuth()

  useEffect(()=>{
    if(!isAuthenticated){
      if(!userToken) {
          const storedToken = window.localStorage.getItem(KVS_LOCAL_STORAGE_KEY);
          const userToken: TokenDetails = storedToken ? JSON.parse(storedToken) : null;
          setUserToken(userToken ?? {token : ""});
      }
      if(userToken && !newTokenFetched) {
          const tokenExpired = userToken && userToken.expiry < Date.now()/1000;
          console.log("tokenExpired : ", tokenExpired)
          if(!tokenExpired) tokenRenew(userToken.token);
          setNewTokenFetched(true);
      }
    }
    console.log(userToken, newTokenFetched)
      
  },[userToken])

  return (
      <Router>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/hlsPlayer" element={<HlsPlayer />} />
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
            <Route path="/signup" element={<RegisterPage />} />
            <Route path="/logout" element={<LogoutPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Router>
  );
}

export default App;
