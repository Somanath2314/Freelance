import mongoose,{Schema} from "mongoose";
//mongodb adds unique ids automatically
const userSchema=new Schema({
    username:
    {
         type:String,
         required:true,   
    },
    role: {
        type: String,
        enum: ["user", "admin","employee"],
        default: "user"
    },

    email:
    {
        type:String,
        required:true,
        unique:true,
        lowecase:true,
        trim:true
    }, 
    phoneNum:{
        type:String,
        required:[true,"phone number is required"]
    },
    password:{
        type:String,
        required:[true,"password is required"]//message to frontend
    }, 
},{timestamps:true})

export const User=mongoose.model("User",userSchema)//create the document by this name