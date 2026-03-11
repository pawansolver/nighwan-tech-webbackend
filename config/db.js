const { Sequelize } = require('sequelize');
require('dotenv').config();

// Asli database connection (SSMS ke liye config update kiya)
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 1433,
    dialect: 'mssql', // Aap SSMS use kar rahe hain isliye mssql zaroori hai
    logging: false,
    dialectOptions: {
        options: {
            encrypt: true,
            trustServerCertificate: true // Local SSMS connection ke liye zaroori
        }
    }
});

// Test Connection function
const connectDB = async () => {
    try {
        // Ab hum authenticate ko uncomment kar rahe hain kyunki aapke paas credentials hain
        await sequelize.authenticate();
        console.log('✅ SQL Server Connected successfully (NTPLWebsite)!');
    } catch (error) {
        console.error('❌ Database Connection Error:', error.message);
    }
};

module.exports = { sequelize, connectDB };