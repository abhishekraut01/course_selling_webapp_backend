const express = require(express);
const jwt = require("jsonwebtoken");

const handleUserAuth = (req, res, next) => {
  try {
    const token = req.cookie.jwt;

    if (!token) {
      return res.status(403).json({
        message: "Could not varify token please login/signup",
      });
    }

    const isTokenValid = jwt.verify(token, process.env.JWT_KEY);

    if (!isTokenValid) {
      return res.status(403).json({
        message: "Token is invalid please login Again",
      });
    }
    next()
  } catch (error) {
    next(error);
  }
};

module.exports = handleUserAuth