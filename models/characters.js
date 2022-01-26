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
        allowNull: true
    },
    lastname: {
        type: DataTypes.STRING,
        allowNull: true
    },
    gender: {
        type: DataTypes.STRING
    },
    age:{
        type: DataTypes.INTEGER
    },
    dob: {
        type: DataTypes.DATE,
        allowNull: false
    }

})

module.exports = Characters;