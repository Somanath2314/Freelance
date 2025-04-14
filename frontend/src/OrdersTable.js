import React from 'react';
import './OrdersTable.css';


const OrdersTable = () => {

    return (
        
            <div className="orders-table-container">
            <h1>Orders Table</h1>
            <table className="orders-table">
            <thead>
            <tr>
            <th>Order ID</th>
            <th>Customer Name</th>
            <th>Goods Type</th>
            <th>Weight of Good</th>
            <th>Total Price</th>
             </tr>
             </thead>
            <tbody>
             <tr>
             <td>1</td>
             <td>John Doe</td>
             <td>Electronics</td>
                        <td>$20</td>
                        <td>$20</td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>Jane Smith</td>
                        <td>Clothing</td>
                        <td>1kg</td>
                        <td>$30</td>
                    </tr>
                    <tr>
                        <td>3</td>
                        <td>Mike Johnson</td>
                        <td>Furniture</td>
                        <td>15kg</td>
                        <td>$200</td>
                    </tr>
                    <tr>
                        <td>4</td>
                        <td>Emily Davis</td>
                        <td>Books</td>
                        <td>2kg</td>
                        <td>$25</td>
                    </tr>
                    <tr>
                        <td>5</td>
                        <td>Chris Brown</td>
                        <td>Electronics</td>
                        <td>3kg</td>
                        <td>$150</td>
                    </tr>


                </tbody>

            </table>
        </div>

    );

};




export default OrdersTable;
