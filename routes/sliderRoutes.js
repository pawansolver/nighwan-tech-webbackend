const express = require('express');
const router = express.Router();
const sliderController = require('../controllers/sliderController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload'); // Slider image upload ke liye

// ==========================================
// 🌍 PUBLIC ROUTE (Frontend Fetch)
// ==========================================
router.get('/', sliderController.getSliders);

// ==========================================
// 🛡️ ADMIN PROTECTED ROUTES (Token + Upload)
// ==========================================

// 1. Admin list (Saare sliders dikhayega)
// 🔥 FIX: Aapke controller mein iska naam 'getAllSlidersAdmin' hai
router.get('/admin/all', auth, sliderController.getAllSlidersAdmin);

// 2. Create Slider (With Image)
router.post('/', auth, upload.single('image'), sliderController.createSlider);

// 3. Update Slider
router.put('/:id', auth, upload.single('image'), sliderController.updateSlider);

// 4. Single Delete
router.delete('/:id', auth, sliderController.deleteSlider);

// 5. Bulk Delete
// 🔥 FIX: Aapke controller mein iska naam 'deleteMultipleSliders' hai
router.post('/DeleteMultiple', auth, sliderController.deleteMultipleSliders);
router.get('/:id', auth, sliderController.getSliderById);
module.exports = router;