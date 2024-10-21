import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/authSlice';
import { useNavigate } from 'react-router-dom';
import ChartComponent from './ChartComponent';
import FilterComponent from './FilterComponent';


const DashBoard = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAuthenticated = useSelector((state) => state.userSlice.isAuthenticated);

  const handleLogout = () => {
    dispatch(logout()); // Dispatch the logout action
    navigate('/login'); // Redirect to login page after logout
  };

  const handleCopyToClipboard = () => {
    const url = window.location.href; // Get the current URL

    navigator.clipboard.writeText(url) // Copy the URL to the clipboard
      .then(() => {
        alert('URL copied to clipboard!'); // Optional: Show a confirmation
      })
      .catch(err => {
        console.error('Could not copy URL: ', err);
      });
  };

  return (

    <>
    {isAuthenticated && (
        <div className="flex justify-between items-center mb-4">

            <h1 className="text-2xl font-bold">Data Dashboard</h1>

            <button 
                onClick={handleLogout} 
                className="bg-grey-500 text-white font-semibold py-2 px-4 rounded shadow hover:bg-blue-600 transition duration-200"
            >
                Logout
            </button>

            
        </div>
    )}

    <button 
        onClick={handleCopyToClipboard} 
        className="bg-green-500 text-white font-semibold py-2 px-4 rounded shadow hover:bg-green-600 transition duration-200 mb-4"
    >
        Share URL
    </button>

    <main className="flex flex-col space-y-4">
        <FilterComponent />
        <ChartComponent />
    </main>
</>


);
}

export default DashBoard