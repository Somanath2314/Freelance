
import { Order } from "../models/order.models.js";
import { v4 as uuidv4 } from 'uuid';

async function generateShortId() {
    const uuid = uuidv4(); // generates UUID like '8c3a7604-f03c-4d08-96b9-bc6c5ff5aecc'
    const buffer = Buffer.from(uuid.replace(/-/g, ''), 'hex'); // remove dashes and convert to buffer
    let base64Id = buffer.toString('base64'); // convert to base64

    // Make it URL-safe and remove padding (=)
    base64Id = base64Id.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    return base64Id;
}
export const createOrder = async (req, res) => {
    // user id is required
    try {
        console.log("before create");
        const { user, weight, category, modeOfTransport, status } = req.body;
        // generate trackingNumber using some uuid?
        const trackingNumber = await generateShortId()
        const order = await Order.create({ user, trackingNumber, weight, category, modeOfTransport, status });
        console.log("after create");
        res.status(201).json(order);
    }catch(error){
        res.status(500).json({ message: error.message });
    }
}

export const ordersByUser = async (req, res) => {
    try {
        // needs id here also
        const { user } = req.params;
        const orders = await Order.find({ user });
        res.status(200).json(orders);
    }catch(error){
        res.status(500).json({ message: error.message });
    }
}

export const getOrderByTrackingNumber = async (req, res) => {
    try {
        const { trackingNumber } = req.params;
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
        res.status(200).json(orders);
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