import React, { useState, useEffect } from 'react';
import './CustomerDetailsTable.css';

const CustomerDetailsTable = () => {
  const initialCustomers = [
    { id: 1, name: 'John Doe', status: 'Pending' },
    { id: 2, name: 'Jane Smith', status: 'Shipped' },
    { id: 3, name: 'Alice Johnson', status: 'Delivered' },
  ];

  const [customers, setCustomers] = useState(() => {
    const savedCustomers = localStorage.getItem('customers');
    return savedCustomers ? JSON.parse(savedCustomers) : initialCustomers;
  });

  useEffect(() => {
    localStorage.setItem('customers', JSON.stringify(customers));
  }, [customers]);

  const updateStatus = (id, newStatus) => {
    setCustomers(customers.map(customer =>
      customer.id === id ? { ...customer, status: newStatus } : customer
    ));
  };

  return (
    <div className="customer-details-container">
      <h2 className="neon-title">Customer Details</h2>
      <table className="neon-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Status</th>
            <th>Update Status</th>
          </tr>
        </thead>
        <tbody>
          {customers.map(customer => (
            <tr key={customer.id}>
              <td>{customer.id}</td>
              <td>{customer.name}</td>
              <td>{customer.status}</td>
              <td>
                <select
                  className="neon-select"
                  onChange={(e) => updateStatus(customer.id, e.target.value)}
                  value={customer.status}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Transit">In Transit</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerDetailsTable;
