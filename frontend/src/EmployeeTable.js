import React, { useState } from 'react';
import './EmployeeTable.css';

const EmployeeTable = ({ showSummary = true }) => {

  const [employees, setEmployees] = useState([
    { 
      id: 1, 
      name: 'John Doe', 
      position: 'Manager', 
      email: 'john@example.com',
      department: 'Operations',
      hireDate: '2022-01-15'
    },
    { 
      id: 2, 
      name: 'Jane Smith', 
      position: 'Developer', 
      email: 'jane@example.com',
      department: 'Engineering', 
      hireDate: '2023-03-10'
    }
  ]);

  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', position: '', email: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddEmployee = () => {
    const newEmployee = {
      id: employees.length + 1,
      ...formData
    };
    setEmployees([...employees, newEmployee]);
    setFormData({ name: '', position: '', email: '' });
  };

  const handleEdit = (employee) => {
    setEditingId(employee.id);
    setFormData({
      name: employee.name,
      position: employee.position,
      email: employee.email
    });
  };

  const handleUpdate = () => {
    setEmployees(employees.map(emp => 
      emp.id === editingId ? { ...emp, ...formData } : emp
    ));
    setEditingId(null);
    setFormData({ name: '', position: '', email: '' });
  };

  const handleDelete = (id) => {
    setEmployees(employees.filter(emp => emp.id !== id));
  };

  return (
    <div className="employee-management">
      <h2>Employee Management</h2>
      {showSummary && (
        <div className="employee-summary">
          <h3>Employee Dashboard</h3>
          <div className="summary-stats">
            <div className="stat-card">
              <div className="stat-value">{employees.length}</div>
              <div className="stat-label">Total Employees</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">
                {employees.filter(e => e.position.toLowerCase().includes('manager')).length}
              </div>
              <div className="stat-label">Managers</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">
                {new Set(employees.map(e => e.department)).size}
              </div>
              <div className="stat-label">Departments</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">
                {new Date(Math.max(...employees.map(e => new Date(e.hireDate).getTime())))
                  .toLocaleDateString()}
              </div>
              <div className="stat-label">Newest Hire</div>
            </div>
          </div>
        </div>
      )}


      <div className="employee-form">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="position"
          placeholder="Position"
          value={formData.position}
          onChange={handleInputChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
        />
        {editingId ? (
          <button onClick={handleUpdate}>Update Employee</button>
        ) : (
          <button onClick={handleAddEmployee}>Add Employee</button>
        )}
      </div>
      <table className="employee-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Position</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(employee => (
            <tr key={employee.id}>
              <td>{employee.id}</td>
              <td>{employee.name}</td>
              <td>{employee.position}</td>
              <td>{employee.email}</td>
              <td>
                <button onClick={() => handleEdit(employee)}>Edit</button>
                <button onClick={() => handleDelete(employee.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeTable;
