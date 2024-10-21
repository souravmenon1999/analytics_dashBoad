import React, { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { loginUser } from '../../../features/authSlice';

const LoginForm = () => {

  const currentParams = window.location.search || ''

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [notification, setNotification] = useState(''); 

  const loading = useSelector((state) => state.userSlice.loading);

  const { from, search } = location.state || { from: '/dashboard', search: '' };
  
  

   // Redirect to intended page

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    let formIsValid = true;
    const newErrors = { email: '', password: '' };

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
      formIsValid = false;
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required.';
      formIsValid = false;
    }

    setErrors(newErrors);
    return formIsValid;
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Dispatch the login action
      dispatch(loginUser({ email: formData.email, password: formData.password }))
      .unwrap() // Unwrap the thunk to directly handle the resolved or rejected result
      .then(() => {
       
        // If registration is successful, navigate to the OTP verify page
        navigate(`/dashboard${currentParams}`);


 // Adjust this path as per your routing setup
      })
      .catch((err) => {
        console.error('Registration failed:', err);
        setNotification('Login failed. Please check your email and password.');
      });
    }
  };

  const handleNavigate = () => {
    navigate(`/register${currentParams}`);
  };

  return (
    
    <div className="flex items-center justify-center min-h-screen ">
  <div className=" rounded-lg shadow-lg p-8 w-full max-w-md bg-gray-800">
    <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>

    {notification && <div className="mb-4 text-red-500 text-center">{notification}</div>} {/* Notification */}
    <form onSubmit={handleSubmit}>
      <div className="form-group mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="text"
          name="email"
          id="email"
          value={formData.email}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
      </div>

      <div className="form-group mb-6">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          value={formData.password}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.password && <span className="text-red-500 text-sm">{errors.password}</span>}
      </div>

      <button type="submit" className="w-full bg-green-900 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200 ">{loading ? 'Loading...' : 'Login'}</button>
    </form>
    <button onClick={handleNavigate} className="mt-4 w-full text-blue-600 hover:underline">Register New User</button>
  </div>
</div>

  );
};

export default LoginForm;
