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
        type: Number,
        required: true
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
})

export const Order = mongoose.model("Order", orderSchema);