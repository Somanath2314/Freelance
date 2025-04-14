import { User } from "../../models/user.models.js";
import bcrypt from "bcrypt";

/**
 * Generates an access token for a user
 * @param {string} userId - The user ID to generate a token for
 * @returns {Promise<Object>} Object containing the access token
 */
const generateAccessToken = async (userId) => {
    try {
        console.log("Generating access token for user:", userId);
        
        const user = await User.findById(userId);
        
        if (!user) {
            throw new Error("User not found");
        }
        
        const accessToken = await user.generateAccessToken();
        
        await user.save({ validateBeforeSave: false });
        console.log("Access token generated successfully");
        
        return { accessToken };
    } catch (error) {
        console.log("Error generating access token:", error);
        throw error; // Re-throw the error so the calling function can handle it
    }
};

/**
 * Register a new user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
const registerUser = async (req, res) => {
    console.log("Processing user registration request");
    try {
        const { username, role, email, phoneNum } = req.body;
        let { password } = req.body;
        
        // Check if required fields are present
        if (!username || !email || !password || !phoneNum) {
            return res.status(400).json({ message: "All fields are required" });
        }
        
        console.log(`Registration attempt: ${username}, ${email}, ${phoneNum}`);
        
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User with this email already exists" });
        }
        
        // Hash password before saving
        const hashedPassword = await bcrypt.hash(password, 10);
        password = hashedPassword;
        
        // Create new user
        const user = await User.create({
            username,
            role,
            email,
            phoneNum,
            password
        });
        
        console.log(`User created with ID: ${user._id}`);
        
        // Generate access token
        let accessToken;
        try {
            const result = await generateAccessToken(user._id);
            accessToken = result.accessToken;
        } catch (error) {
            console.log("Failed to generate access token:", error);
            return res.status(500).json({ message: "Error generating access token" });
        }
        
        // Return success response
        console.log("Registration successful, sending response");
        // In registerUser function, after generating the accessToken
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // true in production
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000 // 1 day in milliseconds
        });
        return res.status(201).json({
            message: "User registered successfully",
            user: {
                _id: user._id,
                username: user.username,
                email: user.email
            },
            accessToken
        });
    } catch (error) {
        console.log("Registration error:", error);
        return res.status(500).json({
            message: "Error during registration process",
            error: error.message
        });
    }
};

export { registerUser };