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
import Streamer from './components/RTMPStreamer/Streamer.tsx'

// ToDo - Routes should be in App.tsx
// main.tsx should return App

const router = createBrowserRouter(
  createRoutesFromChildren(
    <>
      {/* ToDo - redirect root to home */}
      <Route path='/home' element={<Home/>}/>
      <Route path='/login' element={<LoginPage/>}/>
      <Route path='/devices' element={<DevicePage/>}/>
      <Route path='/stream' element={<Streamer />}/>
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