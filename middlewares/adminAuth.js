const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const HandleAdminAuth = async (req, res, next) => {

  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(403).json({ msg: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_KEY);

    // Attach user data (like userId) to the request for further use
    req.admin = decoded;
    next();
  } catch (error) {
    res.status(401).json({ msg: "Invalid token." });
  }
  
};

module.exports = HandleAdminAuth;
