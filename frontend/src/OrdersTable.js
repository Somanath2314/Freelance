import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Loader2, Search, Filter, RefreshCw } from 'lucide-react';
import './OrdersTable.css'; // Import the separate CSS file

const OrdersTable = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const response = await axios.get('http://localhost:8080/api/v1/order/getAllOrders');
                setOrders(response.data);
                setError(null);
            } catch (error) {
                console.error("Error fetching orders:", error);
                setError("Failed to load orders. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const filteredOrders = orders.filter(order => 
        order.trackingNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.status?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const tableVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { staggerChildren: 0.05 }
        }
    };

    const rowVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.3 }
        }
    };

    const getStatusClass = (status) => {
        switch(status?.toLowerCase()) {
            case 'delivered':
                return 'status-delivered';
            case 'in transit':
                return 'status-transit';
            case 'pending':
                return 'status-pending';
            case 'cancelled':
                return 'status-cancelled';
            default:
                return 'status-pending';
        }
    };

    if (loading) {
        return (
            <div className="orders-container loading-container">
                <Loader2 className="loading-spinner" size={32} />
                <p>Loading orders...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="orders-container error-container">
                <div className="error-message">
                    <h3>Error Loading Orders</h3>
                    <p>{error}</p>
                    <button className="retry-button">
                        <RefreshCw size={16} />
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="orders-container">
            <div className="orders-header">
                <motion.h1 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    Orders Management
                </motion.h1>
                
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="search-container"
                >
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search orders..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="filter-button">
                        <Filter size={18} />
                    </button>
                </motion.div>
            </div>

            {filteredOrders.length === 0 ? (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="empty-state"
                >
                    <p>
                        {orders.length === 0 ? "No orders found in the system." : "No orders match your search criteria."}
                    </p>
                </motion.div>
            ) : (
                <div className="table-container">
                    <motion.table 
                        className="orders-table"
                        variants={tableVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <thead>
                            <tr>
                                <th>Tracking Number</th>
                                <th>Weight</th>
                                <th>Category</th>
                                <th>Transport Mode</th>
                                <th>Status</th>
                                <th>Created At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map((order, index) => (
                                <motion.tr 
                                    key={order._id || index}
                                    variants={rowVariants}
                                >
                                    <td className="tracking-cell">{order.trackingNumber}</td>
                                    <td>{order.weight}</td>
                                    <td>{order.category}</td>
                                    <td>{order.modeOfTransport}</td>
                                    <td>
                                        <span className={`status-badge ${getStatusClass(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </motion.table>
                </div>
            )}
            
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="table-footer"
            >
                Showing {filteredOrders.length} of {orders.length} orders
            </motion.div>
        </div>
    );
};

export default OrdersTable;