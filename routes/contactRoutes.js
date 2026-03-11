const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const auth = require('../middleware/auth'); // 🔥 Security Guard (Admin routes ke liye)

// ==========================================
// 🌍 PUBLIC ROUTES (Bina Token Ke)
// ==========================================
// 1. Main Contact Page Route (Purana wala)
router.post('/submit', contactController.submitContact);

// 2. Project Inquiry Modal Route (Naya wala - Isse hi Query save hogi)
router.post('/inquiry', contactController.submitInquiry);

// ==========================================
// 🛡️ ADMIN PROTECTED ROUTES (Token Zaroori Hai)
// ==========================================
// 3. GET All Leads (Contact + Inquiry dono ki list)
router.get('/', auth, contactController.getAllLeads);

// 4. GET Lead By ID (Kisi ek lead ki puri detail)
router.get('/:id', auth, contactController.getLeadById);

// 5. PUT - Update Lead (Jaise status 'New' se 'Contacted' karna)
router.put('/:id', auth, contactController.updateLead);

// 6. DELETE - Single Lead Delete
router.delete('/:id', auth, contactController.deleteLead);

// 7. POST - Bulk Delete (Ek saath multiple leads delete karna)
router.post('/DeleteMultiple', auth, contactController.deleteMultipleLeads);

module.exports = router;