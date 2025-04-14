import { User } from "../../models/user.models.js";
import bcrypt from "bcrypt";

/**
 * Login an existing user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
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
const loginUser = async (req, res) => {
  console.log("Processing user login request");
  try {
    const { email, password } = req.body;

    // Validate input fields
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    console.log(`Login attempt: ${email}`);

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate access token
    let accessToken;
    try {
      const result = await generateAccessToken(user._id);
      accessToken = result.accessToken;
    } catch (error) {
      console.log("Failed to generate access token:", error);
      return res.status(500).json({ message: "Error generating access token" });
    }

    // Set access token as HTTP-only cookie
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    // Send success response
    console.log("Login successful, sending response");

    return res.status(200).json({
      message: "Logged in successfully",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      accessToken
    });
  } catch (error) {
    console.log("Login error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
};

export { loginUser };
