import { User } from "../models/user.models";
import { Order } from "../models/order.models";


const getTotalOrderNumbers = async (req, res) => {
    try {
        const totalOrderNumbers = await Order.countDocuments();
        res.json({ totalOrderNumbers });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateStatus = async (req, res) => {
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
};


const totalShipmentsToday = async (req, res) => {
    try {
        const today = new Date();
        const shipmentToday = await Order.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: new Date(today.setHours(0, 0, 0, 0)),
                        $lt: new Date(today.setHours(23, 59, 59, 999)),
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    totalShipmentsToday: { $sum: 1 },
                },
            },
        ]);
        res.json({ shipmentToday });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { getTotalOrderNumbers, updateStatus, totalShipmentsToday };
