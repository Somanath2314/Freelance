import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import App from './App';
import AdminLogin from './AdminLogin'; // ✅
import EmployeeTable from './EmployeeTable';
import AdminDashboard from './AdminDashboard';
import CustomerDetailsTable from './CustomerDetailsTable';
import EmployeeManagement from './EmployeeManagement';
import OrdersTable from './OrdersTable';
import Customerlogin from './customerLogin';
import CustomerLanding from './zcustomerlanding';
import ShipNow from './zshipnow';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/employeetable" element={<EmployeeTable />} />
      <Route path="/admindashboard" element={<AdminDashboard />} />
      <Route path="/customerdetails" element={<CustomerDetailsTable />} />
      <Route path="/employeemanagement" element={<EmployeeManagement />} />
      <Route path="/orders" element={<OrdersTable />} />
      <Route path="/customer-login" element={<Customerlogin />} />
      <Route path="/customer-dashboard" element={<CustomerLanding />} />
      <Route path="/shipnow" element={<ShipNow />} />

    </Routes>
  </BrowserRouter>
);
