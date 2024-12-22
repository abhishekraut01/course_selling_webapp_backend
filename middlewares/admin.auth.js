const jwt = require("jsonwebtoken");

const handleAdminAuth = (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      throw new Error("Token not found. Please log in or sign up.");
    }

    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.admin = decoded;

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = handleAdminAuth;
