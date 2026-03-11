const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Slider = sequelize.define('Slider', {
    label: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
    },
    // 🔥 NEW: Image ka path save karne ke liye column zaroori hai
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: true, // Agar aap default SVG use kar rahe hain toh true rakh sakte hain
    },
    // MSSQL mein ENUM kabhi kabhi issue deta hai, isliye STRING use karein
    componentType: {
        type: DataTypes.STRING,
        defaultValue: 'growth',
        allowNull: false
    },
    order: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true, // MSSQL ise BIT (0 ya 1) mein convert karta hai
    }
}, {
    schema: 'Website', // 🔥 Career aur Leads ki tarah ise bhi Website schema mein rakhein
    tableName: 'sliders',
    timestamps: true,
});

module.exports = Slider;