import mongoose,{Schema} from "mongoose";
import jwt from "jsonwebtoken";

//mongodb adds unique ids automatically
const userSchema=new Schema({
    username:{
         type:String,
         required:true,   
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    email:{
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
//used to compare the password
userSchema.methods.isPasswordcorrect=async function(password)
{
    return await bcrypt.compare(password,this.password)

}

userSchema.methods.generateAccessToken = async function () { 
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            name: this.name,
            role: this.role  // Include role in the token payload
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1d" }
    );
};

userSchema.methods.generateRefreshToken=async function(){ 

    return jwt.sign(
        {
            _id:this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
       {expiresIn:"10d"}
      )
}
export const User = mongoose.model("User", userSchema)