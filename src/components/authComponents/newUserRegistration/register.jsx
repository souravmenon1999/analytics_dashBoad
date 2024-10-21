import React, { useState } from 'react';
import { registerUser } from '../../../features/authSlice'; // Import the action creator
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentParams = window.location.search || ''

  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: '',
    });
  };

  // Basic form validation
  const validate = () => {
    let newErrors = {};
    if (!formData.firstname) newErrors.firstname = 'First name is required';
    if (!formData.lastname) newErrors.lastname = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6)
      newErrors.password = 'Password must be at least 6 characters long';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      // Dispatch the registerUser action with formData
      dispatch(registerUser(formData))
        .unwrap() // Unwrap the thunk to directly handle the resolved or rejected result
        .then(() => {
          // If registration is successful, navigate to the OTP verify page
          navigate(`/login${currentParams}`); // Adjust this path as per your routing setup
        })
        .catch((err) => {
          console.error('Registration failed:', err);
        });
    }
  };

  return (
    <div className="register-form-container">
      <h2>Register New User</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="firstname">First Name</label>
          <input
            type="text"
            name="firstname"
            id="firstname"
            value={formData.firstname}
            onChange={handleChange}
          />
          {errors.firstname && <span className="error">{errors.firstname}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="lastname">Last Name</label>
          <input
            type="text"
            name="lastname"
            id="lastname"
            value={formData.lastname}
            onChange={handleChange}
          />
          {errors.lastname && <span className="error">{errors.lastname}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
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

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterForm;
