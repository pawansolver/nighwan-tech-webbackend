const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { signupSchema, loginSchema } = require('../config/utils/validators');

// --- 1. SIGNUP LOGIC ---
exports.signup = async (req, res) => {
    try {
        const { error } = signupSchema.validate(req.body);
        if (error) return res.status(400).json({ success: false, error: error.details[0].message });

        const { fullName, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            fullName,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            success: true,
            userName: user.fullName,
            message: "Account Created Successfully!"
        });
    } catch (err) {
        console.error("Signup Error:", err);
        res.status(500).json({ success: false, error: "Email already registered or Database Error" });
    }
};

// --- 2. LOGIN LOGIC ---
exports.login = async (req, res) => {
    try {
        const { error } = loginSchema.validate(req.body);
        if (error) return res.status(400).json({ success: false, error: error.details[0].message });

        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ success: false, error: "Invalid Credentials" });
        }

        const token = jwt.sign(
            { id: user.id, name: user.fullName, email: user.email },
            process.env.JWT_SECRET || 'nighwantech_secret_key_2026',
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            token,
            redirectTo: '/crm-dashboard',
            user: { name: user.fullName, email: user.email }
        });
    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ success: false, error: "Server Error" });
    }
};

// --- 3. FORGOT PASSWORD ---
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) return res.status(404).json({ success: false, error: "Email not found" });

        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 30 * 60 * 1000;
        await user.save();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
        const mailOptions = {
            from: `"Nighwan Tech Support" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: 'Password Reset Request',
            html: `<p>Click here to reset: <a href="${resetUrl}">Reset Link</a></p>`
        };

        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: "Reset link sent to email!" });
    } catch (err) {
        res.status(500).json({ success: false, error: "Error sending email" });
    }
};

// --- 4. GET ALL USERS (Admin Only) ---
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({ attributes: { exclude: ['password'] } });
        res.json({ success: true, data: users });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// --- 5. UPDATE USER ---
exports.updateUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ success: false, error: "User not found" });

        await user.update(req.body);
        res.json({ success: true, message: "User updated successfully" });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// --- 6. DELETE USER (Single or Multiple) ---
exports.deleteUsers = async (req, res) => {
    try {
        const { ids } = req.body; // Array for bulk, req.params.id for single
        const targetIds = ids || [req.params.id];

        await User.destroy({ where: { id: targetIds } });
        res.json({ success: true, message: "User(s) deleted successfully" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};