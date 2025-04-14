import { User } from "../../models/user.models.js"; 

const generateAccessToken = async (userId) => {
    try {
        console.log("came here at generation of tojkens method");
        console.log(userId);
        
        const user = await User.findById(userId); 
        
        if (!user){
            return res.status(404).json({ message: "User not found" });
        }

        const accessToken = await user.generateAccessToken();  
        await user.save({ validateBeforeSave: false });
        console.log(accessToken);
        
        return { accessToken };
    } catch (error) {
        console.log("some error", error); 
    }
};




const loginUser = async (req, res) => {

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify password using bcrypt
    // No need to specify rounds for bcrypt.compare()
    // bcrypt.compare() automatically extracts the number of rounds from the hashed password
    // The rounds parameter was only needed during password hashing at registration
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate access token
    const { accessToken } = await generateAccessToken(user._id);

    // Set cookie with access token
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    // Send success response
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
    console.log("some error", error);
    return res.status(500).json({ message: "Internal server error"+error }); 
  } 
};

export { loginUser };