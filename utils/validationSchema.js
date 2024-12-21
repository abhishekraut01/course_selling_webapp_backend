const { z } = require("zod");

const adminSignUpSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters long"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    email: z.string().email("Invalid email format"),
});

module.exports = { adminSignUpSchema };
