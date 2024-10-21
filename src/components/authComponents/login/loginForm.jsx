import React, { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { loginUser } from '../../../features/authSlice';

const LoginForm = () => {

  const currentParams = window.location.search || ''

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

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
      });
    }
  };

  const handleNavigate = () => {
    navigate(`/register${currentParams}`);
  };

  return (
    <div className="login-form-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="text"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <span className="error">{errors.password}</span>}
        </div>

        <button type="submit">Login</button>
      </form>
      <button onClick={handleNavigate}>Register New User</button>
    </div>
  );
};

export default LoginForm;
