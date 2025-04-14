import jwt from "jsonwebtoken"; 
import { User } from "../../models/user.models.js"; 

const getUserProfile = async (req, res) => {
    // Extract token from cookies
    console.log("Fetching user profile...");
    console.log("Cookies: ", req.cookies);
    console.log("Headers: ", req.headers);
    
    const token = req.cookies.accessToken;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // Fetch user details from the database
        const user = await User.findById(decoded._id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Send back the response
        console.log("User found: ", user);
        
        // return res.status(200).json(
        //     new ApiResponse(200, { user }, "Profile fetched successfully")
        // );
        return res.status(200).json({ 
            status: 200, 
            data: { user }, 
            message: "Profile fetched successfully" 
        });
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
    }
};

export { getUserProfile };

