const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require("../models/User");


const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = await UserModel.findOne({ email });
        if (user) {
            return res.status(409)
                .json({ message: 'User is already exist, you can login', success: false });
        }
        
        // Handle both MongoDB and in-memory storage
        let newUser;
        if (UserModel.create) {
            // In-memory storage
            const hashedPassword = await bcrypt.hash(password, 10);
            newUser = UserModel.create({ name, email, password: hashedPassword });
        } else {
            // MongoDB
            newUser = new UserModel({ name, email, password });
            newUser.password = await bcrypt.hash(password, 10);
            await newUser.save();
        }
        
        res.status(201)
            .json({
                message: "Signup successfully",
                success: true
            })
    } catch (err) {
        console.error('Signup error:', err);
        res.status(500)
            .json({
                message: "Internal server error",
                success: false
            })
    }
}


const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
        const errorMsg = 'Auth failed email or password is wrong';
        if (!user) {
            return res.status(403)
                .json({ message: errorMsg, success: false });
        }
        
        // Handle password comparison for both storage types
        let isPassEqual;
        if (user.password.startsWith('$2b$')) {
            // MongoDB - hashed password
            isPassEqual = await bcrypt.compare(password, user.password);
        } else {
            // In-memory - plain text or differently stored password
            isPassEqual = await bcrypt.compare(password, user.password);
        }
        
        if (!isPassEqual) {
            return res.status(403)
                .json({ message: errorMsg, success: false });
        }
        
        // Get user ID based on storage type
        const userId = user._id || user.id;
        
        const jwtToken = jwt.sign(
            { email: user.email, _id: userId },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        )

        res.status(200)
            .json({
                message: "Login Success",
                success: true,
                jwtToken,
                email,
                name: user.name
            })
    } catch (err) {
        console.error('Login error:', err);
        res.status(500)
            .json({
                message: "Internal server error",
                success: false
            })
    }
}

module.exports = {
    signup,
    login
}