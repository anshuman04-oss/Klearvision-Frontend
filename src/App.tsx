/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react'
import {useDispatch} from "react-redux"
import './App.css'

function App() {

  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    // We will take the access token and the expiry time and render the login page if the expiry time has 
    // already gone. else we will redirect to the home page.
    
  }, [])

  return (
    <>
      {/* <LoginPage/> */}
    </>
  )
}

export default App
