import { User } from "../models/user.models.js";
import { Order } from "../models/order.models.js";


const userbyId = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ user });
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        res.status(500).json({ message: "Internal server error" });
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

export {totalShipmentsToday,userbyId };
