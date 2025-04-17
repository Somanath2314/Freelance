import {User} from "../../models/user.models.js"; 
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const updateUser = async (req, res) => {
  console.log("updateUser called");
  
  const token = req.cookies.accessToken;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  console.log("Token: ", token);
  
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const userId = decoded._id;

    // 1. Define which fields are allowed
    const allowedUpdates = ["username", "email", "phoneNum", "password"];
    // 2. Build an updates object by picking only those from req.body
    console.log("Request body: ", req.body);
    
    const updates = {};
    for (let key of allowedUpdates) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    // 3. If password is being changed, hash it
    if (updates.password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(updates.password, salt);
    }

    console.log("updates in the db are being done");
    

    // 4. Perform the update
    const user = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,      // ensure schema validations (e.g. email format, enum) still run
      context: "query",         // needed for some validators
    });
    console.log("User after update: ", user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ message: "User updated successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

