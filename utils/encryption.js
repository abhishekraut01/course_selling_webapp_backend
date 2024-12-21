const bcrypt = require('bcryptjs')

const handleHashPassword = (password) => {
    const saltRound = 10;
    const hashPass = bcrypt.hash(password, saltRound);
    return hashPass;
};

const verifyPassword = async (password, hashedPassword) => {
    try {
        const isMatch = await bcrypt.compare(password, hashedPassword);
        return isMatch;
    } catch (error) {
        console.error("Error in verifyPassword:", error.message); 
        throw new Error("Failed to verify password"); 
    }
};

module.exports = {handleHashPassword , verifyPassword}