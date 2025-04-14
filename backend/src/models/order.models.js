import mongoose,{Schema} from "mongoose";


const orderSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    trackingNumber: {
        type: String,
        required: true,
        unique: true
    },
    weight: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ["Cloth", "Electronics", "Books", "Furniture", "Books", "Vehicle"],
        default: "Cloth"
    },
    modeOfTransport: {
        type: String,
        required: true,
        enum: ["Road", "Air", "Sea"],
        default: "Road"
    },
    status: {
        type: String,
        required: true,
        enum: ["Pending", "In Transit", "Delivered", "Cancelled"],
        default: "Pending"
    }, 
}, {timestamps: true})

export const Order = mongoose.model("Order", orderSchema);