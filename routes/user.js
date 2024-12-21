const { router } = require("express");
const router = router();
const handleUserAuth = require("../middlewares/userAuth");
const jwt = require("jsonwebtoken");

const dotenv = require("dotenv");
dotenv.config();

const userModel = require("../models/userModel");
const coursesModel = require("../models/coursesModel");

const bcrypt = require("bcryptjs");
const zod = require("zod");

const zodSignupSchema = zod.object({
  username: zod.string(),
  password: zod.string().min(),
});

const hashPassword = (password) => {
  const saltRound = 10;
  const hashedPassword = bcrypt.hash(password, saltRound);
  return hashedPassword;
};

router.post("/signup", (req, res) => {
  const userRes = zodSignupSchema.safeParse(req.body);

  if (!userRes.success) {
    res.status(411).json({
      msg: "username and password schema is invalid",
    });
  }

  const username = req.body.username;
  const password = req.body.password;
  const hashPass = hashPassword(password);

  try {
    const newUser = new userModel({
      username: username,
      password: hashPass,
    });
    newUser.save();
    res.json({
      message: "user created successfully",
    });
  } catch (error) {
    res.status(500).status({
      msg: "unable to create user ",
    });
  }
  //creating jwt and stored in jwt
  try {
    const token = jwt.sign({ username, hashPass }, process.env.JWT_KEY);
    res.cookie("jwt", token, {
      httpOnly: true,
      secure,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });
  } catch (error) {
    res.status(500).json({ msg: "unable to create the token" });
  }

  res.status(200).json({ msg: "user created successfully" });
});

router.post("/login", async (req, res) => {
  const userRes = zodSignupSchema.safeParse(req.body);

  if (!userRes.success) {
    return res.status(411).json({
      msg: "username and password schema is invalid",
    });
  }
  const username = req.body.username;
  const password = req.body.password;

  const user = await userModel.findOne({ username, password });
  if (!user) {
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

router.get("/courses", async (req, res) => {
  try {
    await coursesModel.find({});
    res.status(200).json({
      allCourses,
    });
  } catch (error) {
    res.status(500).json({ message: "unable to fetch courses" });
  }
});

router.post("/courses/:courseId", handleUserAuth, async (req, res) => {
  const courseId = req.params.courseId;
  const { username, password } = req.user;

  try {
    const result = await userModel.updateOne(
      {
        username,
        password,
      },
      {
        $push: {
          purchasedCourses: courseId,
        },
      }
    );

    if (result.modifiedCount > 0) {
      res.status(200).json({ message: "Course purchased successfully" });
    } else {
      res.status(400).json({ message: "Unable to purchase the course. Please check your credentials or the course ID." });
    }
  } catch (error) {
    res.status(500).json({ message: "Unable to purchase the course", error: error.message });
  }
});


router.get("/purchasedCourses", handleUserAuth, async (req, res) => {
  const { username, password } = req.user;

  try {
    const targetedUser = await userModel.findOne({ username, password });

    if (!targetedUser) {
      return res.status(404).json({ message: "User not found. Please check your credentials." });
    }

    const purchasedCourses = targetedUser.purchasedCourses;

    res.status(200).json({
      message: "Purchased courses retrieved successfully",
      purchasedCourses,
    });
  } catch (error) {
    res.status(500).json({
      message: "Unable to retrieve purchased courses",
      error: error.message,
    });
  }
});


module.exports = router;
