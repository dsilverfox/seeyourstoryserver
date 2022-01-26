const express = require('express');
const router = express.Router();
const { models } = require('../models');

//Test Route
router.get('/practice', (req, res) => {
    res.send('Hey!! This is a practice route!')
});

router.post('/create', async (req, res) => {
    const { firstname, lastname, gender, age, dob } = req.body.characters
    try {
        await models.CharactersModel.create({
            firstname: firstname,
            lastname: lastname,
            gender: gender,
            age: age,
            dob: dob
        })
            .then(
                characters => {
                    res.status(201).json({
                        characters: characters,
                        message: 'Character created'
                    })
                }
            )
    } catch (err) {
        res.status(500).json({
            error: `Failed to Create Character: ${err}`
        });
    };
});

module.exports = router;