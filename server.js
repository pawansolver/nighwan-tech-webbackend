// File: server.js

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./config/swagger');

const { sequelize, connectDB } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const applyRoutes = require('./routes/applyRoutes');
const contactRoutes = require('./routes/contactRoutes');
const sliderRoutes = require('./routes/sliderRoutes');
const addressRoutes = require('./routes/addressRoutes');

dotenv.config();
const app = express();

// ==========================================
// ⚙️ GLOBAL MIDDLEWARE (CORS OPENED FOR VERCEL)
// ==========================================
// 🔥 FIX: Ab koi bhi Vercel link block nahi hoga! 'origin: *' kar diya hai.
app.use(cors({
    origin: "*",
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// 🔥 FIX: Render ke liye extra bypass layer
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 📁 Static Folder for Uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ==========================================
// 📒 SWAGGER CONFIGURATION
// ==========================================
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
    swaggerOptions: { persistAuthorization: true }
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

app.listen(PORT, '0.0.0.0', async () => {
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