const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');

router.get('/', addressController.getAll);           // GET /api/Address
router.post('/', addressController.create);         // POST /api/Address
router.get('/:id', addressController.getById);      // GET /api/Address/{id}
router.put('/:id', addressController.update);       // PUT /api/Address/{id}
router.delete('/:id', addressController.delete);    // DELETE /api/Address/{id}
router.post('/DeleteMultiple', addressController.deleteMultiple); // POST /api/Address/DeleteMultiple

module.exports = router;