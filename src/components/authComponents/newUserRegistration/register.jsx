import React, { useState } from 'react';
import { registerUser } from '../../../features/authSlice'; // Import the action creator
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [notification, setNotification] = useState(''); 

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
          setNotification(`${err}`); 
        });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen ">
  <div className="rounded-lg shadow-lg p-8 w-full max-w-md bg-gray-800">
    <h2 className="text-2xl font-semibold text-center text-white mb-6">Register New User</h2>
    {notification && <div className="mb-4 text-red-500 text-center">{notification}</div>} {/* Notification */}

    <form onSubmit={handleSubmit}>
      <div className="form-group mb-4">
        <label htmlFor="firstname" className="block text-sm font-medium text-gray-300">First Name</label>
        <input
          type="text"
          name="firstname"
          id="firstname"
          value={formData.firstname}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.firstname && <span className="text-red-500 text-sm">{errors.firstname}</span>}
      </div>

      <div className="form-group mb-4">
        <label htmlFor="lastname" className="block text-sm font-medium text-gray-300">Last Name</label>
        <input
          type="text"
          name="lastname"
          id="lastname"
          value={formData.lastname}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.lastname && <span className="text-red-500 text-sm">{errors.lastname}</span>}
      </div>

      <div className="form-group mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          value={formData.email}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
      </div>

      <div className="form-group mb-6">
        <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
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

      <button type="submit" className="w-full bg-green-900 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200">Register</button>
    </form>
  </div>
</div>

  );
};

export default RegisterForm;
