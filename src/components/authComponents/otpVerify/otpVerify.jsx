import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { verifyOtp } from '../../../features/authSlice';

const OTPVerifyForm = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentParams = window.location.search || ''

  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { value } = e.target;

    // Allow only numbers and restrict to 6 digits
    if (value.length <= 6 && /^\d*$/.test(value)) {
      setOtp(value);
      setError('');
    }
  };

  const validateOTP = () => {
    if (otp.length !== 6) {
      setError('Please enter a 6-digit OTP.');
      return false;
    }
    return true;
  };

 // Handle form submission
 const handleSubmit = (e) => {
  e.preventDefault();

  if (validateOTP()) {
    // Dispatch the verifyOtp action with the entered OTP
    dispatch(verifyOtp({ otp }))
      .unwrap()
      .then(() => {
        // If OTP verification is successful, navigate to the next page
        navigate(`/login${currentParams}`); // Adjust the path as needed after successful OTP verification
      })
      .catch((err) => {
        console.error('OTP Verification failed:', err);
      });
  }
};
  return (
    <div className="otp-verify-form-container">
      <h2>Verify OTP</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="otp">Enter OTP</label>
          <input
            type="text"
            name="otp"
            id="otp"
            value={otp}
            onChange={handleChange}
            maxLength="6"
          />
          {error && <span className="error">{error}</span>}
        </div>

        <button type="submit">Verify OTP</button>
      </form>
    </div>
  );
};

export default OTPVerifyForm;
