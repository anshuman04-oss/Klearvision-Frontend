import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import './App.css'
import StreamingPage from './StreamingPage/StreamingPage.tsx'
import HomePage from "./HomePage/HomePage.tsx";

function App() {

  return (
    <>

    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/StreamingPage" element={<StreamingPage />} />
      </Routes>
    </Router>
    </>
  )
}

export default App
