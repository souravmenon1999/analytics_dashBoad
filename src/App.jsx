import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import RegisterForm from './components/authComponents/newUserRegistration/register.jsx';
import OTPVerifyForm from './components/authComponents/otpVerify/otpVerify.jsx';
import LoginForm from './components/authComponents/login/loginForm.jsx';
import DashBoard from './components/dashBoard.jsx';
import { useSelector } from 'react-redux';
import './index.css'; // Adjust the path if needed

function App() {
  const isAuthenticated = useSelector(state => state.userSlice.isAuthenticated);
  const currentParams = window.location.search || ''
  
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>
        <Route
          path="/dashboard"
          element={
            (function() {
              return isAuthenticated ? <DashBoard /> : <Navigate to={`/login${currentParams}`} />;
            })()
          }
        />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/otp-verify" element={<OTPVerifyForm />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  )
}

export default App