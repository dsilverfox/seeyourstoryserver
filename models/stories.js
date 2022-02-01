const { DataTypes } = require("sequelize");
const db = require("../db");

const Stories = db.define("stories", {
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
    content: {
        type: DataTypes.TEXT,
        allowNull: true,
    }
});

module.exports = Stories;