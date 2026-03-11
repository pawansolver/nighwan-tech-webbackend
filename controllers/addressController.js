const Address = require('../models/Address');

// 1. GET /api/Address (Sab fetch karne ke liye)
exports.getAll = async (req, res) => {
    try {
        const data = await Address.findAll();
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// 2. POST /api/Address (Naya add karne ke liye)
exports.create = async (req, res) => {
    try {
        // 🛠️ DEBUG: Terminal mein check karein ki data aa raha hai ya nahi
        console.log("Incoming Data:", req.body);

        const data = await Address.create(req.body);
        res.status(201).json({
            success: true,
            message: "Address added successfully!",
            data
        });
    } catch (err) {
        console.error("POST Error:", err.message);
        res.status(400).json({ success: false, error: err.message });
    }
};

// 3. GET /api/Address/{id} (Single fetch)
exports.getById = async (req, res) => {
    try {
        const data = await Address.findByPk(req.params.id);
        if (!data) return res.status(404).json({ success: false, error: "Address not found" });
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// 4. PUT /api/Address/{id} (Update karne ke liye)
exports.update = async (req, res) => {
    try {
        const address = await Address.findByPk(req.params.id);
        if (!address) return res.status(404).json({ success: false, error: "Address not found" });

        // Data update karein aur naya object return karein
        const updatedData = await address.update(req.body);
        res.json({
            success: true,
            message: "Address updated successfully",
            data: updatedData
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// 5. DELETE /api/Address/{id} (Single delete)
exports.delete = async (req, res) => {
    try {
        const result = await Address.destroy({ where: { id: req.params.id } });
        if (!result) return res.status(404).json({ success: false, error: "Address not found" });

        res.json({ success: true, message: "Address deleted successfully" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// 6. POST /api/Address/DeleteMultiple (Bulk delete)
exports.deleteMultiple = async (req, res) => {
    try {
        const { ids } = req.body; // Expecting an array: { "ids": [1, 2, 3] }

        if (!ids || !Array.isArray(ids)) {
            return res.status(400).json({ success: false, error: "Please provide an array of IDs" });
        }

        await Address.destroy({ where: { id: ids } });
        res.json({ success: true, message: "Selected addresses deleted successfully" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};