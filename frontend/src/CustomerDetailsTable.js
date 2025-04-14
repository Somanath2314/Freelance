import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CustomerDetailsTable.css';

const CustomerDetailsTable = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updateAnimation, setUpdateAnimation] = useState(null);

  // Fetch orders and user details
  useEffect(() => {
    const fetchOrdersAndUsers = async () => {
      try {
        setLoading(true);
        const ordersRes = await axios.get('http://localhost:8080/api/v1/order/getAllOrders');
        const orders = ordersRes.data;
        
        // Map user IDs to names by fetching them
        const customersWithNames = await Promise.all(
          orders.map(async (order) => {
            const userRes = await axios.get(`http://localhost:8080/api/v1/order/user/${order.user}`);
            const userName = userRes.data.user.username;
            
            return {
              id: order._id,
              name: userName,
              status: order.status,
              userId: order.user
            };
          })
        );
        
        setCustomers(customersWithNames);
      } catch (error) {
        console.error('Error fetching orders or users:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrdersAndUsers();
  }, []);

  const updateStatus = async (orderId, newStatus) => {
    try {
      setUpdateAnimation(orderId);
      
      await axios.patch(`http://localhost:8080/api/v1/order/updateStatus/${orderId}`, {
        status: newStatus,
      });
      
      setCustomers(customers =>
        customers.map(c =>
          c.id === orderId ? { ...c, status: newStatus } : c
        )
      );
      
      setTimeout(() => {
        setUpdateAnimation(null);
      }, 1500);
    } catch (error) {
      console.error('Error updating status:', error);
      setUpdateAnimation(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return '#ffaa00';
      case 'In Transit': return '#00aaff';
      case 'Delivered': return '#00ff88';
      case 'Canceled': return '#ff3366';
      default: return '#00eaff';
    }
  };

  return (
    <div className="customer-details-container">
      <div className="header-section">
        <h2 className="neon-title">Customer Details</h2>
        <div className="neon-subtitle">Order Management Dashboard</div>
      </div>
      
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading customer data...</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="neon-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer Name</th>
                <th>Status</th>
                <th>Update Status</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer, index) => (
                <tr 
                  key={customer.id}
                  className={`fade-in-row ${updateAnimation === customer.id ? 'update-animation' : ''}`} 
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <td className="order-id">{customer.id}</td>
                  <td className="customer-name">{customer.name}</td>
                  <td>
                    <span 
                      className="status-indicator" 
                      style={{backgroundColor: getStatusColor(customer.status)}}
                    ></span>
                    <span className="status-text">{customer.status}</span>
                  </td>
                  <td>
                    <select
                      className="neon-select"
                      onChange={(e) => updateStatus(customer.id, e.target.value)}
                      value={customer.status}
                      style={{borderColor: getStatusColor(customer.status)}}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Transit">In Transit</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Canceled">Canceled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <div className="table-footer">
        <div className="total-orders">
          <span>Total Orders: {customers.length}</span>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailsTable;