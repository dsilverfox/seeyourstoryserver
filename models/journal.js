const { DataTypes, DATE } = require("sequelize");
const db = require("../db");

const Journal = db.define("journal", {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
    },
    title: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: true,
    }
});

module.exports = Journal;