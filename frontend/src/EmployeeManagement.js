import React from 'react';
import EmployeeTable from './EmployeeTable';
import './EmployeeManagement.css';


const EmployeeManagement = () => {
  return (

    <div className="employee-management-page">
      <div className="management-header">
        <h1>Employee Management System</h1>
        <button 
          className="back-button"
        >

          Back to Dashboard
        </button>
      </div>
      
      <div className="employee-content">
        <EmployeeTable />
      </div>
    </div>
  );
};

export default EmployeeManagement;
