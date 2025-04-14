import mongoose,{Schema} from "mongoose";
//mongodb adds unique ids automatically
const userSchema=new Schema({
    username:
    {
         type:String,
         required:true,
         unique:true,
         lowercase:true,
         trim:true,
         index:true

    },

    email:
    {
        type:String,
        required:true,
        unique:true,
        lowecase:true,
        trim:true
    },
    password:
    {
        type:String,
        required:true,
        trim:true
    },
    
    refreshToken:
    {
        type:String
    }

},{timestamps:true})

export const User=mongoose.model("User",userSchema)//create the document by this name