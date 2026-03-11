const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Lead = sequelize.define('Lead', {
    fullName: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: false },

    // 🔥 NEW: Ye batayega ki lead kaun se sub-menu/page se aayi hai
    sourcePage: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'Direct'
    },

    // 🔥 NEW: Budget store karne ke liye (Modal ke liye zaroori)
    budget: {
        type: DataTypes.STRING,
        allowNull: true
    },

    message: {
        type: DataTypes.TEXT,
        allowNull: true // Isse 'true' karein taaki modal bina message ke bhi submit ho jaye
    },

    type: {
        type: DataTypes.STRING,
        defaultValue: 'GENERAL' // Isme hum 'PROJECT_INQUIRY' ya 'CONTACT_FORM' bhejenge
    }
}, {
    schema: 'Website',
    tableName: 'Leads',
    timestamps: true
});

module.exports = Lead;