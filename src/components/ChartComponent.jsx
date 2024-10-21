// src/components/ChartComponent.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { setData } from '../features/dataFiltersSlice';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, TimeScale } from 'chart.js';
import 'chartjs-adapter-date-fns';
import zoomPlugin from 'chartjs-plugin-zoom';




ChartJS.register(BarElement, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale);
ChartJS.register(zoomPlugin);

const ChartComponent = () => {
  const dispatch = useDispatch();
  const chartData = useSelector((state) => state.dataFilters.data);
  const ageGroup = useSelector((state) => state.dataFilters.ageGroup);
  const gender = useSelector((state) => state.dataFilters.gender);
  const startDate = useSelector((state) => state.dataFilters.startDate);
  const endDate = useSelector((state) => state.dataFilters.endDate);
  

  const chartRef = useRef(null);

  const [selectedFeature, setSelectedFeature] = useState(null);
  const [lineChartData, setLineChartData] = useState({
    labels: [],
    datasets: [],
  });
  const lineChartRef = useRef(null);

  const labels = ['A', 'B', 'C', 'D', 'E', 'F']; // Features for the Y-axis
  let totalValues = Array(labels.length).fill(0);
  let count = Array(labels.length).fill(0);

  // Initialize an array to hold the total values for each feature
  const values = Array(labels.length).fill(0);
  if (chartData.length) {
    chartData.forEach(item => {
      labels.forEach((label, index) => {
        // Convert the value to a number and check if it's not NaN
        const value = Number(item[label]);
        if (!isNaN(value)) {
          totalValues[index] += value; // Sum the values for each feature
          count[index]++; // Increment the count for each feature
        }
      });
    });
  }

  let averageValues = totalValues.map((total, index) => (count[index] ? total / count[index] : 0));
  
  const dataForChart = {
    labels: labels, // Customize based on your dataset
    datasets: [
      {
        label: 'Data Label',
        data: averageValues, // Customize based on your dataset
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };


  const barChartOptions = {
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        const feature = dataForChart.labels[index];
        handleFeatureClick(feature); // Update line chart based on clicked bar
      }
    },
    responsive: true,
    indexAxis: 'y',
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  const LineChartDates = [];
  const LineChartValues = [];

  // Handle bar click and update line chart data
  const handleFeatureClick = (feature) => {
    setSelectedFeature(feature);

    // Destroy existing chart if it exists
  if (lineChartRef.current && lineChartRef.current.chartInstance) {
    lineChartRef.current.chartInstance.destroy();
  }

    
    chartData.forEach(item => {
      if (item[feature] !== undefined) {
        LineChartDates.push(item.Day); // Add the date
        LineChartValues.push(parseInt(item[feature], 10)); // Parse the feature value as an integer and add it
      }
    });
   
    setLineChartData({
      labels: LineChartDates,
      datasets: [
        {
          label: feature,
          data: LineChartValues,
          borderColor: 'blue',
          fill: false,
        },
      ],
    });
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
        zoom: {
            pan: {
                enabled: true,
                mode: 'x',
            },
            zoom: {
                enabled: true,
                mode: 'x',
                wheel: {
                    enabled: true,
                },
            },
        },
    },
    scales: {
        x: {
            type: 'category', // Change this to 'category' if you have categorical data
        },
        y: {
            beginAtZero: true,
        },
    },
};




  return (
    <div className="flex flex-col items-center">
    <h2 className="text-xl font-bold mb-4">Chart</h2>

    {chartData.length > 0 ? (
        <div className="flex justify-center mb-4">
            <Bar data={dataForChart} options={{ ...barChartOptions }} className="w-full md:w-1/2" />
        </div>
    ) : (
        <p>No data available for the selected filters.</p>
    )}

    {selectedFeature && lineChartData.datasets.length > 0 ? (
        <div className="flex flex-col md:flex-row items-center justify-center w-full space-x-4">
            <div className="w-full md:w-1/2 mb-4 md:mb-0" style={{ height: '400px' }}> {/* Adjust height here */}
                <h2 className="text-xl font-bold mb-2">{selectedFeature} - Line Chart</h2>
                <Line 
                    ref={lineChartRef} 
                    data={lineChartData} 
                    options={{ ...lineChartOptions, maintainAspectRatio: false }} // Ensure maintainAspectRatio is false
                />
            </div>
        </div>
    ) : (
        selectedFeature && <p>No data available for this feature.</p>
    )}
</div>



  );
};

export default ChartComponent;
