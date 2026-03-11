const Lead = require('../models/Lead');

// ==========================================
// 1. POST - Submit Contact Form (Public)
// ==========================================
exports.submitContact = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, message } = req.body;
        // 🔥 Aapka Logic: FirstName aur LastName ko jodhkar FullName banayein
        const fullName = `${firstName} ${lastName}`.trim();

        const newEntry = await Lead.create({
            fullName,
            email,
            phone,
            message,
            type: 'CONTACT_FORM'
        });

        res.status(201).json({
            success: true,
            message: "Contact details saved successfully!",
            data: newEntry
        });

    } catch (err) {
        console.error("Contact Error:", err);
        res.status(500).json({ success: false, error: "Database error" });
    }
};

/// ==========================================
// 2. POST - Submit Project Inquiry (Public)
// ==========================================
exports.submitInquiry = async (req, res) => {
    try {
        const { fullName, email, phone, budget, message, sourcePage } = req.body;

        const newInquiry = await Lead.create({
            fullName,
            email,
            phone,
            budget,          // 🔥 FIX 1: Budget ko directly uske column mein bhej diya
            message,         // 🔥 FIX 2: Message ko cleanly pass kar diya bina merge kiye
            sourcePage: sourcePage || 'Inquiry Modal',
            type: 'PROJECT_INQUIRY'
        });

        res.status(201).json({
            success: true,
            message: "Inquiry saved successfully!",
            data: newInquiry
        });
    } catch (err) {
        console.error("Inquiry Error:", err);
        res.status(500).json({ success: false, error: "Database error" });
    }
};
// ==========================================
// 3. GET - Get All Leads (Admin Only)
// ==========================================
exports.getAllLeads = async (req, res) => {
    try {
        // Nayi leads upar dikhengi
        const leads = await Lead.findAll({ order: [['createdAt', 'DESC']] });
        res.status(200).json({ success: true, data: leads });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// ==========================================
// 4. GET - Get Lead By ID (Admin Only)
// ==========================================
exports.getLeadById = async (req, res) => {
    try {
        const lead = await Lead.findByPk(req.params.id);
        if (!lead) return res.status(404).json({ success: false, message: "Lead not found" });
        res.status(200).json({ success: true, data: lead });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// ==========================================
// 5. PUT - Update Lead Status (Admin Only)
// ==========================================
exports.updateLead = async (req, res) => {
    try {
        const lead = await Lead.findByPk(req.params.id);
        if (!lead) return res.status(404).json({ success: false, message: "Lead not found" });

        await lead.update(req.body);
        res.status(200).json({ success: true, message: "Lead updated successfully!", data: lead });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// ==========================================
// 6. DELETE - Single Delete (Admin Only)
// ==========================================
exports.deleteLead = async (req, res) => {
    try {
        const lead = await Lead.findByPk(req.params.id);
        if (!lead) return res.status(404).json({ success: false, message: "Lead not found" });

        await lead.destroy();
        res.status(200).json({ success: true, message: "Lead deleted successfully!" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// ==========================================
// 7. POST - Bulk Delete (Admin Only)
// ==========================================
exports.deleteMultipleLeads = async (req, res) => {
    try {
        const { ids } = req.body;
        if (!ids || ids.length === 0) return res.status(400).json({ success: false, message: "No IDs provided" });

        await Lead.destroy({ where: { id: ids } });
        res.status(200).json({ success: true, message: "Selected leads deleted successfully!" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};