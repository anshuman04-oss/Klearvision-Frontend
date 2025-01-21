/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/PrivateRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { Status } from '../constants';
import Loading from '../components/Loading';
import useAuth from '../hooks/useAuth';
import { isTokenExpired } from '../helpers';
import { PrivateRouteProps } from '../types';

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const {status, isAuthenticated} = useAuth();
  const tokenExpired = isTokenExpired();
  const loading = status === Status.LOADING;

  console.log(`userState: isAuthenticated=${isAuthenticated}, loading=${loading}, tokenExpired=${tokenExpired}`)

  return (
    <>
      {loading && !tokenExpired && <Loading />}
      {!isAuthenticated && tokenExpired && <Navigate to='/login' />}
      {isAuthenticated && children}
    </>
  )
};

export default PrivateRoute;
