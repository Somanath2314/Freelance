import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminDashboard.css';
import './EmployeeTable.css';
import backgroundVideo from './airr2.mp4';
import EmployeeTable from './EmployeeTable';

const AdminDashboard = () => {
    const [activeView, setActiveView] = useState('dashboard');
    const [orderCount, setOrderCount] = useState(0);
    const [shipmentCount, setShipmentCount] = useState(0);
    const [pendingStatusCount, setPendingStatusCount] = useState(0);
    const videoRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play().catch(error => {
                console.log("Video autoplay prevented:", error);
            });
        }
    }, []);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const ordersRes = await axios.get('http://localhost:8080/api/v1/order/getOrderCount');
                setOrderCount(ordersRes.data.orderCount);

                const shipmentsRes = await axios.get('http://localhost:8080/api/v1/order/ordersToBeShippedToday');
                setShipmentCount(shipmentsRes.data);

                const pendingRes = await axios.get('/api/orders/pending');
                setPendingStatusCount(pendingRes.data.count);
            } catch (error) {
                console.error("Error fetching stats:", error);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="admin-dashboard">
            <div className="video-container">
                <video
                    ref={videoRef}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="background-video"
                >
                    <source src={backgroundVideo} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>

                {activeView === 'dashboard' && (
                    <div className="dashboard-container">
                        <h1>Admin Dashboard</h1>
                        <div
                            className="dashboard-cards"
                            onWheel={(e) => {
                                e.preventDefault();
                                e.currentTarget.scrollLeft += e.deltaY;
                            }}
                        >
                            <div className="card">
                                <h2>Total Orders</h2>
                                <p>{orderCount} Orders</p>
                            </div>

                            <div className="card">
                                <h2>Update Status</h2>
                                <p>{pendingStatusCount} customers</p>
                                <button onClick={() => navigate('/update-status')}>
                                    Go to Update Status
                                </button>
                            </div>

                            <div className="card">
                                <h2>Total Shipments Today</h2>
                                <p>{shipmentCount} Shipments</p>
                            </div>

                            <div className="card">
                                <h2>Employee Management</h2>
                                <p>Manage employee records</p>
                                <button onClick={() => navigate('/manage-employees')}>
                                    Go to Manage Employees
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {activeView === 'employees' && (
                <EmployeeTable onBack={() => setActiveView('dashboard')} />
            )}
        </div>
    );
};

export default AdminDashboard;
