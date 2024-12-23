/* eslint-disable @typescript-eslint/no-unused-vars */
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { store } from './app/store.ts'
import { BrowserRouter, createBrowserRouter, createRoutesFromChildren, Route, RouterProvider, Routes } from 'react-router-dom'
import LoginPage from './components/LoginPage/LoginPage.tsx'
import DevicePage from './components/Devices/DevicePage.tsx'
import Home from './components/HomePage/Home.tsx'

const router = createBrowserRouter(
  createRoutesFromChildren(
    <>
      <Route path='/' element={<Home/>}/>
      <Route path='/login' element={<LoginPage/>}/>
      <Route path='/devices' element={<DevicePage/>}/>
    </> 
  )
)

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <RouterProvider router={router}/>
  </Provider>
)















{/* <Route path='' element={<Home/>}>
<Route path='/login' element={<LoginPage/>}/>
<Route path='/devices' element={<DevicePage/>}/>
</Route> */}