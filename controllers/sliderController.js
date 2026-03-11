const Slider = require('../models/Slider');
const fs = require('fs');
const path = require('path');

// 1. GET - Frontend (Sirf Active Sliders)
exports.getSliders = async (req, res) => {
    try {
        const sliders = await Slider.findAll({
            where: { isActive: true },
            order: [['order', 'ASC']]
        });
        res.status(200).json({ success: true, data: sliders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
    }
};

// 2. POST - Create Slider (With Image Upload)
exports.createSlider = async (req, res) => {
    try {
        const { title, description, label, link, order, componentType } = req.body;

        if (!req.file) {
            return res.status(400).json({ success: false, message: "Please upload an image" });
        }

        const imageUrl = `/uploads/sliders/${req.file.filename}`;

        const newSlider = await Slider.create({
            title,
            description,
            label,
            imageUrl,
            link,
            componentType: componentType || 'growth',
            order: order || 0,
            isActive: true
        });

        res.status(201).json({ success: true, data: newSlider });
    } catch (error) {
        console.error("POST Error:", error); // VS Code terminal check karein
        res.status(500).json({ success: false, message: error.message || "Error creating slider" });
    }
};

// 3. GET - Admin (All Sliders)
exports.getAllSlidersAdmin = async (req, res) => {
    try {
        const sliders = await Slider.findAll({ order: [['order', 'ASC']] });
        res.status(200).json({ success: true, data: sliders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 4. PUT - Update Slider (Text + Image Change)
exports.updateSlider = async (req, res) => {
    try {
        const slider = await Slider.findByPk(req.params.id);
        if (!slider) return res.status(404).json({ success: false, message: "Slider not found" });

        let updateData = { ...req.body };

        if (req.file) {
            if (slider.imageUrl) {
                // 🔥 FIXED PATH LOGIC: Windows compatible path
                const relativePath = slider.imageUrl.startsWith('/') ? slider.imageUrl.substring(1) : slider.imageUrl;
                const oldPath = path.join(process.cwd(), relativePath);

                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }
            updateData.imageUrl = `/uploads/sliders/${req.file.filename}`;
        }

        await slider.update(updateData);
        res.status(200).json({ success: true, data: slider });
    } catch (error) {
        console.error("PUT Error:", error);
        res.status(500).json({ success: false, message: error.message || "Error updating slider" });
    }
};

// 5. DELETE - Single Slider (With File Cleanup)
exports.deleteSlider = async (req, res) => {
    try {
        const slider = await Slider.findByPk(req.params.id);
        if (!slider) return res.status(404).json({ success: false, message: "Not found" });

        if (slider.imageUrl) {
            // 🔥 FIXED PATH LOGIC
            const relativePath = slider.imageUrl.startsWith('/') ? slider.imageUrl.substring(1) : slider.imageUrl;
            const filePath = path.join(process.cwd(), relativePath);

            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        await slider.destroy();
        res.status(200).json({ success: true, message: "Deleted successfully" });
    } catch (error) {
        console.error("DELETE Error:", error);
        res.status(500).json({ success: false, message: error.message || "Error deleting slider" });
    }
};

// 6. POST - Bulk Delete
exports.deleteMultipleSliders = async (req, res) => {
    try {
        const { ids } = req.body;
        await Slider.destroy({ where: { id: ids } });
        res.status(200).json({ success: true, message: "Selected sliders deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
// 7. GET - Single Slider by ID (Admin ya Frontend ke liye)
exports.getSliderById = async (req, res) => {
    try {
        const slider = await Slider.findByPk(req.params.id);

        // Agar id database mein nahi mili
        if (!slider) {
            return res.status(404).json({ success: false, message: "Slider not found" });
        }

        // Agar mil gayi toh return kar do
        res.status(200).json({ success: true, data: slider });
    } catch (error) {
        console.error("GET BY ID Error:", error);
        res.status(500).json({ success: false, message: error.message || "Error fetching slider details" });
    }
};