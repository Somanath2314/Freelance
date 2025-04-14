import React, { useState, useEffect } from 'react';
import './EmployeeTable.css';
import axios from 'axios';

const EmployeeTable = ({ showSummary = true }) => {
  const [employees, setEmployees] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', position: '', email: '' });
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  // Position options from the schema
  const positionOptions = [
    "Warehouse Associate",
    "Delivery Driver",
    "Logistics Coordinator",
    "Operations Manager",
    "Forklift Operator",
    "Supply Chain Analyst",
    "Dispatcher",
    "Customs Clearance Agent",
    "Inventory Manager",
    "Shipping Clerk",
    "Customer Service Representative",
    "Fleet Manager",
    "Package Handler",
    "Transport Supervisor",
    "Route Planner",
    "IT Support Specialist",
    "HR Manager",
    "Finance Officer",
    "Logistics Engineer",
    "Training Supervisor"
  ];

  // Fetch all employees on mount
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/v1/employee');
        setEmployees(res.data);
      } catch (err) {
        console.error("Error fetching employees", err);
        showToast("Failed to load employees", "error");
      }
    };
    fetchEmployees();
  }, []);

  // Toast notification handler
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 3000);
  };

  // Generate a standardized ID from name
  const generateNameId = (name) => {
    return name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .substring(0, 12) + 
      '-' + 
      Math.floor(Math.random() * 1000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddEmployee = async () => {
    try {
      // Generate a name-based ID for new employees
      const nameId = generateNameId(formData.name);
      const employeeWithId = { ...formData, displayId: nameId };
      
      const res = await axios.post('http://localhost:8080/api/v1/employee', employeeWithId);
      setEmployees([...employees, res.data]);
      setFormData({ name: '', position: '', email: '' });
      showToast("Employee added successfully");
    } catch (err) {
      console.error("Error adding employee", err);
      showToast("Failed to add employee", "error");
    }
  };

  const handleEdit = (employee) => {
    setEditingId(employee._id);
    setFormData({
      name: employee.name,
      position: employee.position,
      email: employee.email
    });
    showToast("Editing employee information", "info");
  };

  const handleUpdate = async () => {
    try {
      const res = await axios.put(`http://localhost:8080/api/v1/employee/${editingId}`, formData);
      setEmployees(employees.map(emp => emp._id === editingId ? res.data : emp));
      setEditingId(null);
      setFormData({ name: '', position: '', email: '' });
      showToast("Employee updated successfully");
    } catch (err) {
      console.error("Error updating employee", err);
      showToast("Failed to update employee", "error");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/v1/employee/${id}`);
      setEmployees(employees.filter(emp => emp._id !== id));
      showToast("Employee deleted successfully");
    } catch (err) {
      console.error("Error deleting employee", err);
      showToast("Failed to delete employee", "error");
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ name: '', position: '', email: '' });
    showToast("Edit cancelled", "info");
  };

  // Get display ID for an employee (use existing displayId or generate from name)
  const getDisplayId = (employee) => {
    return employee.displayId || generateNameId(employee.name);
  };

  return (
    <div className="employee-management">
      <h2>Employee Management</h2>

      {/* Toast Notification */}
      {toast.show && (
        <div className={`toast-notification ${toast.type}`}>
          {toast.message}
        </div>
      )}

      {showSummary && employees.length > 0 && (
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
                {new Set(employees.map(e => e.department || 'N/A')).size}
              </div>
              <div className="stat-label">Departments</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">
                {
                  new Date(
                    Math.max(
                      ...employees.map(e => new Date(e.createdAt || e.updatedAt).getTime())
                    )
                  ).toLocaleDateString()
                }
              </div>
              <div className="stat-label">Newest Hire</div>
            </div>
          </div>
        </div>
      )}

      <div className="form-container">
        <div className="employee-form">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleInputChange}
            className="form-input"
          />
          
          <select
            name="position"
            value={formData.position}
            onChange={handleInputChange}
            className="form-input position-dropdown"
          >
            <option value="" disabled>Select Position</option>
            {positionOptions.map((pos, index) => (
              <option key={index} value={pos}>{pos}</option>
            ))}
          </select>
          
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleInputChange}
            className="form-input"
          />
          
          <div className="form-buttons">
            {editingId ? (
              <>
                <button className="btn-update" onClick={handleUpdate}>Update</button>
                <button className="btn-cancel" onClick={handleCancel}>Cancel</button>
              </>
            ) : (
              <button className="btn-add" onClick={handleAddEmployee}>Add Employee</button>
            )}
          </div>
        </div>
      </div>

      <div className="table-container">
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
              <tr key={employee._id} className={editingId === employee._id ? 'editing-row' : ''}>
                <td className="employee-id">{getDisplayId(employee)}</td>
                <td>{employee.name}</td>
                <td>{employee.position}</td>
                <td>{employee.email}</td>
                <td className="action-cell">
                  <button className="btn-edit" onClick={() => handleEdit(employee)}>Edit</button>
                  <button className="btn-delete" onClick={() => handleDelete(employee._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeTable;