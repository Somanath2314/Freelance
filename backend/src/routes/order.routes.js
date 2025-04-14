import { Router } from "express";
import { createOrder, ordersByUser, getAllOrders, getOrderByTrackingNumber, getOrderCount, ordersToBeShippedToday, updateStatus } from "../controllers/OrderController.js";
import { userbyId } from "../controllers/Admin.controller.js";
const router = Router();

// Create a new order
router.post("/createOrder", createOrder);
router.get("/user/:id", userbyId);
// Get all orders
router.get("/getAllOrders", getAllOrders);

// Get order by tracking number
router.get("/getOrderByTrackingNumber/:trackingNumber", getOrderByTrackingNumber);

// Get orders by user
router.get("/ordersByUser", ordersByUser);

// Get order count
router.get("/getOrderCount", getOrderCount);

// Get orders to be shipped today
router.get("/ordersToBeShippedToday", ordersToBeShippedToday);

// Update order status
router.patch("/updateStatus/:id", updateStatus);

export default router;
