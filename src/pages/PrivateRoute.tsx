// src/components/PrivateRoute.tsx
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from '../app/store';
import { Status } from '../constants';
import Loading from '../components/Loading';

interface PrivateRouteProps {
  children: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const {status, isAuthenticated} = useSelector((state: RootState) => state.user);
  const storedUUID = window.localStorage.getItem("acadomateUUID")
  const storedToken = window.localStorage.getItem("acadomateToken")
  const tokenExpired = storedToken && JSON.parse(storedToken).expiry < Date.now()/1000;
  const loading = status === Status.LOADING;

  console.log("userState",isAuthenticated, loading, tokenExpired)

  return (
    <>
      {loading && storedUUID && storedToken && !tokenExpired && <Loading />}
      {!isAuthenticated && (!storedUUID || !storedToken || tokenExpired) && <Navigate to='/login' />}
      {isAuthenticated && children}
    </>
  )
};

export default PrivateRoute;
