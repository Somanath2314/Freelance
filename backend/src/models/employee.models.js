import mongoose, { Schema } from "mongoose";

const employeeSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    position: {
        type: String,
        required: true, 
        enum: [
            "Warehouse Associate",
            "Delivery Driver",
            "Logistics Coordinator",
            "Operations Manager",
            "Forklift Operator",
            "Supply Chain Analyst",
            "Dispatcher",
            "Customs Clearance Agent",
            "Inventory Manager",
            "Shipping Clerk",
            "Customer Service Representative",
            "Fleet Manager",
            "Package Handler",
            "Transport Supervisor",
            "Route Planner",
            "IT Support Specialist",
            "HR Manager",
            "Finance Officer",
            "Logistics Engineer",
            "Training Supervisor"
        ]
    },
});

export const Employee = mongoose.model("Employee", employeeSchema);
