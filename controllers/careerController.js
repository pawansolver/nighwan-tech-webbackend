const nodemailer = require('nodemailer');
const Application = require('../models/application');

// --- OPERATION 1: POST (Aapka Same Job Apply Logic) ---
exports.applyForJob = async (req, res) => {
    try {
        console.log("Frontend se ye data aaya:", req.body);

        const { fullName, email, phone, appliedFor, department } = req.body;
        const resumeFile = req.file;

        if (!resumeFile) {
            return res.status(400).json({ success: false, error: "Resume file missing hai." });
        }

        // 1. Database mein data save karo (Fast process - isko await karenge)
        const newApplication = await Application.create({
            fullName: fullName || "Unknown",
            email: email || "No Email",
            phone: phone || "No Phone",
            appliedFor: appliedFor || "Not Specified",
            department: department || "General",
            resumePath: resumeFile.path
        });

        // ==========================================
        // 🛠️ YAHI CHANGE HUA HAI: Email Transporter Setup
        // ==========================================
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST || 'smtp.gmail.com',
            port: Number(process.env.EMAIL_PORT) || 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS, // Dhyan rahe, yahan 16-digit App password chahiye
            },
            // 🔥 INDUSTRY FIX 1: Render ka IPv6 error (ENETUNREACH) block karega
            family: 4,

            // 🔥 INDUSTRY FIX 2: Cloud par SSL verification error ko rokkega
            tls: {
                rejectUnauthorized: false
            }
        });

        // 🔥 INDUSTRY STANDARD FIX (Fire and Forget) 🔥
        transporter.sendMail({
            from: `"Nighwan Career" <${process.env.EMAIL_USER}>`,
            to: "support@nighwantech.com",
            subject: `New Application: ${appliedFor || 'New Role'} - ${fullName || ''}`,
            html: `
                <div style="font-family: sans-serif; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
                    <h2 style="color: #fb923c;">New Application Received</h2>
                    <p><strong>Candidate Name:</strong> ${fullName}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Phone:</strong> ${phone}</p>
                    <p><strong>Position:</strong> ${appliedFor}</p>
                    <p><strong>Department:</strong> ${department}</p>
                    <hr />
                    <p style="color: #666;">Candidate's resume is attached below.</p>
                </div>
            `,
            attachments: [{
                filename: resumeFile.originalname,
                path: resumeFile.path
            }]
        }).catch(err => {
            console.error("🚨 Background Email Sending Failed:", err);
        });

        // 3. User ko turant success response de do (Timeout bypass)
        res.status(200).json({
            success: true,
            message: "Application saved successfully! (Email processing in background)",
            data: newApplication
        });

    } catch (error) {
        console.error("Backend Career Error:", error);
        res.status(500).json({ success: false, error: "Server error: " + error.message });
    }
};

// --- OPERATION 2: GET ALL (Admin panel ke liye) ---
exports.getAllApplications = async (req, res) => {
    try {
        const applications = await Application.findAll({ order: [['createdAt', 'DESC']] });
        res.json({ success: true, data: applications });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// --- OPERATION 3: GET BY ID ---
exports.getApplicationById = async (req, res) => {
    try {
        const application = await Application.findByPk(req.params.id);
        if (!application) return res.status(404).json({ success: false, error: "Application not found" });
        res.json({ success: true, data: application });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// --- OPERATION 4: PUT (Update) ---
exports.updateApplication = async (req, res) => {
    try {
        const application = await Application.findByPk(req.params.id);
        if (!application) return res.status(404).json({ success: false, error: "Application not found" });

        await application.update(req.body);
        res.json({ success: true, message: "Application updated successfully", data: application });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// --- OPERATION 5: DELETE (Single) ---
exports.deleteApplication = async (req, res) => {
    try {
        const application = await Application.findByPk(req.params.id);
        if (!application) return res.status(404).json({ success: false, error: "Application not found" });

        await application.destroy();
        res.json({ success: true, message: "Application deleted successfully" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// --- OPERATION 6: POST (Delete Multiple) ---
exports.deleteMultipleApplications = async (req, res) => {
    try {
        const { ids } = req.body;
        if (!ids || ids.length === 0) return res.status(400).json({ success: false, error: "No IDs provided" });

        await Application.destroy({ where: { id: ids } });
        res.json({ success: true, message: "Multiple applications deleted successfully" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};