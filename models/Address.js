const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Address = sequelize.define('Address', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    fullName: { type: DataTypes.STRING, allowNull: false },
    mobile: { type: DataTypes.STRING, allowNull: false },
    addressLine: { type: DataTypes.STRING, allowNull: false },
    city: { type: DataTypes.STRING, allowNull: false },
    state: { type: DataTypes.STRING, allowNull: false },
    pincode: { type: DataTypes.STRING, allowNull: false },
    // 🚀 SQL Server "DEFAULT" error fix: 
    // defaultValue hata diya hai, Sequelize isse ab simple boolean handle karega
    isDefaultAddr: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    }
}, {
    schema: 'Website',
    tableName: 'Addresses',
    timestamps: true
});

module.exports = Address;