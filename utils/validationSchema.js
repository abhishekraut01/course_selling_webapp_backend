const { z } = require("zod");

const adminSignUpSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters long"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

const courseSchema = z.object({
    title: z.string().min(3, "Course title must be at least 3 characters long"),
    description: z.string().min(10, "Course description must be at least 10 characters long"),
    price: z.number().positive("Course price must be a positive number"),
    imageLink: z.string().url("Invalid image link format"),
});


module.exports = { adminSignUpSchema , courseSchema};
