const { router } = require("express");
const router = router();
const dotenv = require("dotenv");
dotenv.config();

const handleAdminAuth = require("../middlewares/adminAuth");
const adminModel = require("../models/adminModel");

const bcrypt = require("bcryptjs");
const zod = require("zod");

app.use(cookieParser());
app.use(express.json());

const jwt = require("jsonwebtoken");
const JWT_KEY = process.env.JWT_KEY;

const zodSignupSchema = zod.object({
  username: zod.string(),
  password: zod.string().min(),
});

const zodCoursesSchema = zod.object({
  title: zod.string(),
  description: zod.string(),
  imageLink: zod.string(),
  price: zod.number(),
});

const hashPassword = (password) => {
  const saltRound = 10;
  const hashedPassword = bcrypt.hash(password, saltRound);
  return hashedPassword;
};

// Route for admin signup
router.post("/signup", async (req, res) => {
  const userRes = zodSignupSchema.safeParse(req.body);

  if (!userRes.success) {
    return res.status(411).json({
      msg: "username and password schema is invalid",
    });
  }

  const username = req.body.username;
  const password = req.body.password;
  const hashPass = hashPassword(password);

  const admin = await adminModel.findOne({ username });
  if (admin) {
    return res.status(401).json({ msg: "User Already exist" });
  }

  try {
    const newUser = new adminModel({
      username: username,
      password: hashPass,
    });
    newUser.save();
  } catch (error) {
    res.status(500).status({
      msg: "unable to create admin ",
    });
  }
  //creating jwt token for user
  const token = jwt.sign({ username, hashPass }, JWT_KEY);

  // Set token in cookie
  res.cookie("jwt", token, {
    httpOnly: true,
    secure,
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.status(200).json({ msg: "Login successful!" });
});

// Route for admin signin
router.post("/login", async (req, res) => {
  const userRes = zodSignupSchema.safeParse(req.body);

  if (!userRes.success) {
    return res.status(411).json({
      msg: "username and password schema is invalid",
    });
  }
  const username = req.body.username;
  const password = req.body.password;

  const admin = await adminModel.findOne({ username, password });
  if (!admin) {
    return res.status(401).json({ msg: "Invalid username or password" });
  }
  // genrating jsonweb token and saved in cookies
  try {
    const token = jwt.sign({ username, password }, JWT_KEY);
    res.cookie("jwt", token, {
      httpOnly: true,
      secure,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });
  } catch (error) {
    res.status(500).json({
      msg: "unable to signIn",
    });
  }
  res.status(200).json({ msg: "Login successful!" });
});

router.post("/logout", (req, res) => {
  res.clearCookie("jwt"); // Clear the cookie
  res.status(200).json({ msg: "Logged out successfully!" });
});

router.post("/courses", handleAdminAuth, async (req, res) => {
  // Validate input
  const userRes = zodCoursesSchema.safeParse(req.body);
  if (!userRes.success) {
    return res.status(400).json({
      msg: "Input is invalid",
      errors: userRes.error.format(),
    });
  }

  const { title, description, imageLink, price } = userRes.data;

  try {
    // Create and save the new course
    const newCourse = await coursesModel.create({
      title,
      description,
      imageLink,
      price,
    });

    // Send success response with created course ID
    return res.status(201).json({
      msg: "Course created successfully",
      courseId: newCourse._id,
    });
  } catch (error) {
    console.error("Error while creating course:", error.message);

    // Send error response
    return res.status(500).json({
      msg: "An error occurred while creating the course. Please try again later.",
    });
  }
});

router.get("/courses", handleAdminAuth, async (req, res) => {
  const adminData = req.admin;
  const { username, password } = adminData;

  try {
    const isUserExist = await adminModel.find({ username, password });

    if (isUserExist) {
      // Get all courses
      const courses = await coursesModel.find({});
      res.status(200).json({
        courses,
      });
    }
  } catch (error) {
    console.error("Error while creating course:", error.message);

    // Send error response
    return res.status(500).json({
      msg: "An error occurred while getting all courses.",
    });
  }
});

module.exports = router;
