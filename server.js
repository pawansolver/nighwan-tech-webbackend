// File: server.js

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// 📝 Swagger Imports
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./config/swagger'); // 🔥 Nayi file yahan import ho gayi!

// 🗄️ Database & Routes Imports
const { sequelize, connectDB } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const applyRoutes = require('./routes/applyRoutes');
const contactRoutes = require('./routes/contactRoutes');
const sliderRoutes = require('./routes/sliderRoutes');
const addressRoutes = require('./routes/addressRoutes');

dotenv.config();
const app = express();

// ==========================================
// ⚙️ GLOBAL MIDDLEWARE
// ==========================================
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 📁 Static Folder for Uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ==========================================
// 📒 SWAGGER CONFIGURATION
// ==========================================
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
    swaggerOptions: {
        persistAuthorization: true
    }
}));

// ==========================================
// 🌍 API ROUTES
// ==========================================
app.get('/', (req, res) => {
    res.send("Backend is Running! View API Docs at /api-docs");
});

app.use('/api/auth', authRoutes);
app.use('/api/career', applyRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/slider', sliderRoutes);
app.use('/api/Address', addressRoutes);

// ==========================================
// 🚀 SERVER & DATABASE START
// ==========================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
    console.log(`🚀 Server is flying on port ${PORT}`);
    console.log(`📖 API Documentation: http://localhost:${PORT}/api-docs`);

    await connectDB();

    try {
        await sequelize.sync({ force: false, alter: false });
        console.log('✅ SQL Server Connected & Data is Locked (Safe Mode)');
    } catch (error) {
        console.error('❌ Table Sync Error:', error.message);
    }
});