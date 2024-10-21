// src/components/FilterComponent.jsx
import React from 'react';
import { useState, useEffect } from 'react';
import { useDispatch,useSelector } from 'react-redux';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'; // Ensure you have this import
import { setAgeGroup, setGender, setDateRange } from '../features/dataFiltersSlice';
import { DateRangePicker } from 'react-date-range';
import { addDays } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { fetchFilteredData } from '../features/dataFiltersSlice';

const FilterComponent = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  const initialStartDate = searchParams.get('startDate') || Cookies.get('startDate') || null;
  const initialEndDate = searchParams.get('endDate') || Cookies.get('endDate') || null;

  // Function to parse date strings into Date objects
  const parseDate = (dateString) => {
    if (!dateString) return null; // Return null if the date string is invalid
    const date = new Date(dateString);
    return !isNaN(date.getTime()) ? date : null; // Return null if the date is invalid
  };

  // State for date range using react-datepicker
  const [startDate, setStartDate] = useState(parseDate(initialStartDate));
  const [endDate, setEndDate] = useState(parseDate(initialEndDate));

  // State for filters with default values
  const [ageGroup, setAgeGroup] = useState(searchParams.get('ageGroup') || Cookies.get('ageGroup') || 'all'); // Default to 'all'
  const [gender, setGender] = useState(searchParams.get('gender') || Cookies.get('gender') || 'all'); // Default to 'all'


  const filters = {
    ageGroup,
    gender,
    startDate,
    endDate,
  };

  useEffect(() => {
    // Fetch data based on filters
    dispatch(fetchFilteredData(filters));

  }, []);

  const handleApplyFilters = () => {
    
  
      dispatch(setDateRange({
        startDate: filters.startDate,
        endDate: filters.endDate,
      }));
      
      dispatch(fetchFilteredData(filters));
      Cookies.set('ageGroup', filters.ageGroup);
      Cookies.set('gender', filters.gender);
      Cookies.set('startDate', filters.startDate ? filters.startDate.toISOString() : null);
      Cookies.set('endDate', filters.endDate ? filters.endDate.toISOString() : null);

     
  };

  const handleResetFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setAgeGroup('all');
    setGender('all');
    
    
    // Fetch filtered data with reset filters
    dispatch(fetchFilteredData({
      ageGroup: 'all',
      gender: 'all',
      startDate: null,
      endDate: null,
    }));
  };

  return (
    <div className="flex flex-col space-y-4">
  <div className="flex flex-wrap justify-center gap-4">
      <div className="w-full sm:w-1/2 md:w-1/4 lg:w-1/4 xl:w-1/4 max-w-[200px]">
        <label className="block text-sm font-medium text-gray-700">Age Group:</label>
        <select
          onChange={(e) => dispatch(setAgeGroup(e.target.value))}
          value={ageGroup}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="all">All</option>
          <option value="15-25">15-25</option>
          <option value=">25">25+</option>
        </select>
      </div>

      <div className="w-full sm:w-1/2 md:w-1/4 lg:w-1/4 xl:w-1/4 max-w-[200px]">
        <label className="block text-sm font-medium text-gray-700">Gender:</label>
        <select
          onChange={(e) => dispatch(setGender(e.target.value))}
          value={gender}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="all">All</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>

      <div className="w-full sm:w-1/2 md:w-1/4 lg:w-1/4 xl:w-1/4 max-w-[200px]">
        <label className="block text-sm font-medium text-gray-700">Start Date:</label>
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          dateFormat="yyyy-MM-dd"
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
          placeholderText="yyyy-MM-dd"
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        />
      </div>

      <div className="w-full sm:w-1/2 md:w-1/4 lg:w-1/4 xl:w-1/4 max-w-[200px]">
        <label className="block text-sm font-medium text-gray-700">End Date:</label>
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          dateFormat="yyyy-MM-dd"
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
          placeholderText="yyyy-MM-dd"
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        />
      </div>
    </div>
 <div className="flex justify-center space-x-4">
    <button 
        onClick={handleResetFilters} 
        className="bg-green-900 text-white font-semibold py-2 px-4 rounded shadow hover:bg-green-600 transition duration-200"
    >
        Reset Filters
    </button>
    <button 
        onClick={handleApplyFilters} 
        className="bg-green-900 text-white font-semibold py-2 px-4 rounded shadow hover:bg-green-600 transition duration-200"
    >
        Apply Filters
    </button>
</div>

</div>

  );
};

export default FilterComponent;
