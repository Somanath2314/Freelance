import React from "react";
import './App.css';


  import Header from "./Header";
  import MainContent from "./MainContent";
  import Footer from "./Footer";
 import AdminLogin from "./AdminLogin";
  import AdminDashboard from "./AdminDashboard";
 import OrdersTable from "./OrdersTable";
 import EmployeeManagement from "./EmployeeManagement";
 import CustomerDetailsTable from "./CustomerDetailsTable"
 import Customerlogin from "./customerLogin";
 import CustomerLanding from './zcustomerlanding';
import ShipNow from './zshipnow';
 


function App() {
  return (
    <div className="App">
    
      <Header />
      <MainContent />
      <Footer />       
      

    </div>
  );
}

export default App;
