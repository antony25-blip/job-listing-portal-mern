const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require("../models/User");
const { OAuth2Client } = require('google-auth-library');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/* ===================== SIGNUP ===================== */
const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                message: 'User already exists, please login',
                success: false
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await UserModel.create({
            name,
            email,
            password: hashedPassword,
            provider: 'local'
        });

        res.status(201).json({
            success: true,
            message: "Signup successful"
        });

    } catch (err) {
        console.error("Signup error:", err);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

/* ===================== LOGIN ===================== */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(403).json({
                success: false,
                message: "Auth failed email or password is wrong"
            });
        }

        if (!user.password) {
            return res.status(403).json({
                success: false,
                message: "Please login using Google"
            });
        }

        const isPassEqual = await bcrypt.compare(password, user.password);
        if (!isPassEqual) {
            return res.status(403).json({
                success: false,
                message: "Auth failed email or password is wrong"
            });
        }

        const userId = user._id || user.id;

        const jwtToken = jwt.sign(
            { email: user.email, _id: userId },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            success: true,
            message: "Login success",
            jwtToken,
            name: user.name,
            email: user.email
        });

    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

/* ===================== GOOGLE LOGIN ===================== */
const googleLogin = async (req, res) => {
    try {
        const { token } = req.body;

        const ticket = await googleClient.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();
        const { sub, email, name } = payload;

        let user = await UserModel.findOne({ googleId: sub });

        if (!user) {
            user = await UserModel.create({
                name,
                email,
                googleId: sub,
                provider: 'google'
            });
        }

        const userId = user._id || user.id;

        const jwtToken = jwt.sign(
            { email: user.email, _id: userId },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            success: true,
            message: "Google login successful",
            jwtToken,
            name: user.name,
            email: user.email
        });

    } catch (err) {
        console.error("Google login error:", err);
        res.status(401).json({
            success: false,
            message: "Google authentication failed"
        });
    }
};

/* ===================== EXPORTS ===================== */
module.exports = {
    signup,
    login,
    googleLogin
};
