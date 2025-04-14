import React, { useState, useRef, useEffect } from 'react';
import './AdminDashboard.css';
import './EmployeeTable.css';
import backgroundVideo from './airr2.mp4'; // Make sure this path is correct
import EmployeeTable from './EmployeeTable';

const AdminDashboard = () => {
    const [activeView, setActiveView] = useState('dashboard');
    const videoRef = useRef(null);

    // Optional: Handle video play promise for browsers that require it
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play().catch(error => {
                console.log("Video autoplay prevented:", error);
                // You might want to add a play button overlay in this case
            });
        }
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
                                <h2>Total Inventory</h2>
                                <p>1000 Items</p>
                                <button onClick={() => alert('Viewing Inventory')}>View Details</button>
                            </div>

                            <div className="card">
                                <h2>Total Orders</h2>
                                <p>250 Orders</p>
                            </div>

                            <div className="card">
                                <h2>Update Status</h2>
                                <p>20 customers</p>
                            </div>

                            <div className="card">
                                <h2>Total Shipments Today</h2>
                                <p>50 Shipments</p>
                            </div>

                            <div className="card">
                                <h2>Employee Management</h2>
                                <p>Manage employee records</p>
                                <button onClick={() => setActiveView('employees')}>
                                    Manage Employees
                                </button>
                            </div>

                            <div className="card">
                                <h2>Recent Activity</h2>
                                <p>Last updated: 10 minutes ago</p>
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