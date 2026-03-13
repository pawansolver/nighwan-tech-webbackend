const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validateRequest = require('../middleware/validate');
const { signupSchema, loginSchema } = require('../config/utils/validators');

// 🚀 1. Pehle Security Guard (Auth Middleware) ko import karein
const auth = require('../middleware/auth');

// --- 1. Public Routes (Inke liye login nahi chahiye) ---
router.post('/signup', validateRequest(signupSchema), authController.signup);
router.post('/login', validateRequest(loginSchema), authController.login);

// 🔥 Forgot & Reset Password Routes
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword); // Naya route add kar diya

// --- 2. Admin/Management Routes (Ab yahan 'auth' lagana compulsory hai) ---
// Har route ke beech mein 'auth' likhiye taaki Token check ho sake
router.get('/users', auth, authController.getAllUsers);
router.put('/user/:id', auth, authController.updateUser);
router.delete('/user/:id', auth, authController.deleteUsers);
router.post('/users/delete-multiple', auth, authController.deleteUsers);

module.exports = router;