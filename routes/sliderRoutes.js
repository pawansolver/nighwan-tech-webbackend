const express = require('express');
const router = express.Router();
const sliderController = require('../controllers/sliderController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// ==========================================
// 🌍 PUBLIC ROUTES (Testing mode: Auth temporary hata diya)
// ==========================================

// 1. Frontend fetch (Active sliders)
router.get('/', sliderController.getSliders);

// 2. Admin list (Saare sliders) - 🔥 auth hata diya
router.get('/admin/all', sliderController.getAllSlidersAdmin);

// 3. Create Slider - 🔥 auth hata diya
router.post('/', upload.single('image'), sliderController.createSlider);

// 4. Update Slider - 🔥 auth hata diya
router.put('/:id', upload.single('image'), sliderController.updateSlider);

// 5. Single Delete - 🔥 auth hata diya
router.delete('/:id', sliderController.deleteSlider);

// 6. Bulk Delete - 🔥 auth hata diya
router.post('/DeleteMultiple', sliderController.deleteMultipleSliders);

// 7. Get by ID - 🔥 auth hata diya
router.get('/:id', sliderController.getSliderById);

module.exports = router;