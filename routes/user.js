const { router } = require("express");
const router = router();
const handleUserAuth = require("../middlewares/userAuth");

const userModel = require("../models/userModel");
const coursesModel = require("../models/coursesModel");

const bcrypt = require("bcryptjs");
const zod = require("zod");

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
});

router.get("/courses", async (req, res) => {
  
});

router.post("/courses:courseId", handleUserAuth, (req, res) => {});

router.get("/purchasedCourses", handleUserAuth, (req, res) => {});

module.exports = router;
