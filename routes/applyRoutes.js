// File: routes/careerRoutes.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const auth = require('../middleware/auth'); // 🛡️ Security Guard
const careerController = require('../controllers/careerController'); // 🔥 Controller ko import kiya

// 1. Multer Setup (File Upload ke liye)
const storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, 'uploads/'); },
    filename: (req, file, cb) => { cb(null, Date.now() + '-' + file.originalname); }
});
const upload = multer({ storage: storage });

// ==========================================
// 🚀 6 OPERATIONS - ROUTING 
// ==========================================

// 1. POST /apply (Public Route - User Apply Karega with Resume)
router.post('/apply', upload.single('resume'), careerController.applyForJob);

// 2. GET ALL / (Admin - Saari applications dekhne ke liye)
router.get('/', auth, careerController.getAllApplications);

// 3. GET BY ID /:id (Admin - Kisi ek application ko dekhne ke liye)
router.get('/:id', auth, careerController.getApplicationById);

// 4. PUT /:id (Admin - Application update karne ke liye)
router.put('/:id', auth, careerController.updateApplication);

// 5. DELETE /:id (Admin - Single Delete)
router.delete('/:id', auth, careerController.deleteApplication);

// 6. POST /DeleteMultiple (Admin - Bulk Delete)
router.post('/DeleteMultiple', auth, careerController.deleteMultipleApplications);

module.exports = router;