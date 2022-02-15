
const {DataTypes} = require('sequelize');
const db = require('../db')

const Characters = db.define('characters',{
    id: {
        type: DataTypes.UUID,
        primaryKey:true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
    },
    firstname: {
        type: DataTypes.STRING,
    },
    lastname: {
        type: DataTypes.STRING,
    },
    gender: {
        type: DataTypes.STRING
    },
    age:{
        type: DataTypes.INTEGER
    },
    dob: {
        type: DataTypes.STRING,
    }

})

module.exports = Characters;