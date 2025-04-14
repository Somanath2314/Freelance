
import { Order } from "../models/order.models.js";
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';

async function generateShortId() {
    const uuid = uuidv4(); // generates UUID like '8c3a7604-f03c-4d08-96b9-bc6c5ff5aecc'
    const buffer = Buffer.from(uuid.replace(/-/g, ''), 'hex'); // remove dashes and convert to buffer
    let base64Id = buffer.toString('base64'); // convert to base64

    // Make it URL-safe and remove padding (=)
    base64Id = base64Id.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    return base64Id;
}


export const createOrder = async (req, res) => {
    console.log("create order"); 
    // user id is required
    try {
        console.log("before create");
        const token = req.cookies.accessToken;
        console.log(token);
        
        if (!token) {
            console.log("no token"); 
            return res.status(401).json({ message: "Unauthorized" });
        }
        console.log("after token");
        // verify token 
        console.log("veryfiying token");
        
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = decoded._id;
        console.log("user id: ", user);
        const {weight, category, modeOfTransport, status="pending" } = req.body;
        // generate trackingNumber using some uuid?
        const trackingNumber = await generateShortId()
        console.log("tracking number: ", trackingNumber);
        console.log(user, weight, category, modeOfTransport, status);
         
        console.log("before create order");
        
        const order = await Order.create({ user, trackingNumber, weight, category, modeOfTransport, status });
        console.log("order created successfully");
        console.log(order);
        
        res.status(201).json(order);
    }
    catch(error){
        res.status(500).json({ message: error.message });
    }
};


export const ordersByUser = async (req, res) => {
    try {
        // needs id here also
        console.log("before create");
        const token = req.cookies.accessToken;
        console.log(token);
        
        if (!token) {
            console.log("no token"); 
            return res.status(401).json({ message: "Unauthorized" });
        }
        console.log("after token");
        // verify token 
        console.log("veryfiying token");
        
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = decoded._id;

        console.log("user id: ", user);
        const orders = await Order.find({ user }).sort({ date: -1 });

        console.log("orders: ", orders); 
        res.status(200).json(orders);
    }catch(error){
        res.status(500).json({ message: error.message });
    }
}

export const getOrderByTrackingNumber = async (req, res) => {
    try {
        const { trackingNumber } = req.params;
        console.log("trackingNumber", trackingNumber);
        const order = await Order.findOne({ trackingNumber });
        res.status(200).json(order);
    }catch(error){
        res.status(500).json({ message: error.message });
    }
}

export const getAllOrders = async (req, res) => {
    try {
        console.log("before find");
        const orders = await Order.find();
        console.log("after find");
        console.log(orders); 
        res.status(200).json(orders);
    }catch(error){
        res.status(500).json({ message: error.message });
    }
}

export const getOrderCount = async (req, res) => {
    try {
        const orderCount = await Order.countDocuments();
        res.status(200).json({ orderCount });
    }catch(error){
        res.status(500).json({ message: error.message });
    }
}
export const ordersToBeShippedToday = async (req, res) => {
    try {
        console.log("before find");
        const orders = await Order.find({ status: "Pending", createdAt: { $gte: new Date(new Date().setDate(new Date().getDate() - 1)) } });
        console.log("after find");
        res.status(200).json(orders.length);
    }catch(error){
        res.status(500).json({ message: error.message });
    }
}

export const updateStatus = async (req, res) => {
    try {
        const { id: order_id } = req.params;
        const { status } = req.body;
        const updatedOrder = await Order.findByIdAndUpdate(order_id, { status }, { new: true });

        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.json({ message: "Order status updated successfully", updatedOrder });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}