const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
// Agar aap Sequelize operators use kar rahe hain resetPassword me:
const { Op } = require('sequelize');
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
            host: process.env.EMAIL_HOST,
            port: Number(process.env.EMAIL_PORT) || 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;

        const mailOptions = {
            from: `"Nighwan Tech Support" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: 'Password Reset Request - Nighwan Tech',
            html: `
              <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden;">
                <div style="background-color: #f97316; padding: 20px; text-align: center;">
                  <h1 style="color: white; margin: 0; font-size: 24px;">NIGHWAN TECH</h1>
                </div>
                <div style="padding: 40px; text-align: center; background-color: white;">
                  <h2 style="color: #1e293b;">Password Reset Request</h2>
                  <p style="color: #64748b; font-size: 16px; line-height: 1.6;">
                    We received a request to reset your password. Click the button below to proceed. This link is valid for 30 minutes.
                  </p>
                  <div style="margin-top: 30px;">
                    <a href="${resetUrl}" style="background-color: #0f172a; color: white; padding: 14px 28px; text-decoration: none; border-radius: 50px; font-weight: bold; display: inline-block;">
                      Reset Password
                    </a>
                  </div>
                  <p style="margin-top: 30px; font-size: 12px; color: #94a3b8;">
                    If you didn't request this, you can safely ignore this email.
                  </p>
                </div>
              </div>
            `
        };

        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: "Reset link sent to email!" });
    } catch (err) {
        console.error("Forgot Password Error:", err);
        res.status(500).json({ success: false, error: "Error sending email" });
    }
};

// --- 4. RESET PASSWORD (NEW ADDITION) ---
exports.resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        const user = await User.findOne({
            where: {
                resetPasswordToken: token,
                resetPasswordExpires: { [Op.gt]: Date.now() } // Token must not be expired
            }
        });

        if (!user) {
            return res.status(400).json({ success: false, error: "Token invalid or expired" });
        }

        // Hash the new password and save
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = null; // Clear the token
        user.resetPasswordExpires = null;
        await user.save();

        res.json({ success: true, message: "Password updated successfully!" });
    } catch (err) {
        console.error("Reset Password Error:", err);
        res.status(500).json({ success: false, error: "Error updating password" });
    }
};

// --- 5. GET ALL USERS (Admin Only) ---
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({ attributes: { exclude: ['password'] } });
        res.json({ success: true, data: users });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// --- 6. UPDATE USER ---
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

// --- 7. DELETE USER (Single or Multiple) ---
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