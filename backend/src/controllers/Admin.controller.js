import { User } from "../models/user.models";
import { Order } from "../models/order.models";




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
