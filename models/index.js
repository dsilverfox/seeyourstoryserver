const db = require('../db');

const UsersModel = require('./users');
const JournalModel = require('./journal');
const StoriesModel = require('./stories');
const CharactersModel = require('./characters');

UsersModel.hasMany(CharactersModel);
UsersModel.hasMany(StoriesModel);
StoriesModel.hasMany(CharactersModel);
CharactersModel.hasOne(JournalModel);

CharactersModel.belongsTo(UsersModel);
JournalModel.belongsTo(CharactersModel);
StoriesModel.belongsTo(UsersModel);


module.exports = {
    dbConnection: db,
    models: {
        UsersModel,
        JournalModel,
        StoriesModel,
        CharactersModel
    }
};