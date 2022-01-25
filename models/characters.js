const {DataTypes} = require('sequelize');
const db = require('../db')

const Characters = db.define('characters',{
    id: {
        type: DataTypes.UUID,
        primaryKey:true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
    },
    firstname: {
        type: String,
        allowNull: true,
    },
    lastname: {
        type: String,
        allowNull: true,
    },
    gender: {
        type: String,
    },
    age:{
        type: Number,
    },
    dob: {
        type: DataTypes.DATE,
        allowNull: false,
    }

})

module.exports = Characters;