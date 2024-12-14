import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const SECRET_KEY = "dnhisckdsjclqwWQIueuih";

export const authenticateUser = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res
      .status(401)
      .json({ error: "Unauthorized access, token required" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    req.user = user; // Attach user details to the request
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};
