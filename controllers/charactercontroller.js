const express = require('express');
const router = express.Router();
const { models } = require('../models');
let validateJWT = require("../middleware/validate-session");

//Test Route
router.get('/practice', (req, res) => {
    res.send('Hey!! This is a practice route!')
});

//CREATE CHARACTER
router.post('/create', validateJWT, async (req, res) => {
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

//VIEW ALL Characters
router.get('/view', validateJWT, async (req, res) => {
    const { id } = req.user
    try {
        const characterPage = await CharactersModel.findAll({
            where: {
                owner_id: id
            }
        })
        res.status(200).json(characterPage);
    } catch (err) {
        res.status(500).json({ Error: err })
    }
})

//VIEW ONE character

router.get('/view/:id', validateJWT, async (req, res) => {
    const { id } = req.user
    const character_id = req.params.id
    try {
        const characterPage = await CharactersModel.findAll({
            where: {
                owner_id: id,
                character_id:character_id
            }
        })
        res.status(200).json(characterPage);
    } catch (err) {
        res.status(500).json({ Error: err })
    }
})

//EDIT character
router.put("/update", validateJWT, async (req, res) => {
    const { firstname, lastname, gender, age, dob } = req.body.character;
    const owner_id = req.user.id;

    const query = {
        where: {
            owner_id: owner_id
        },
    };

    const updatedCharacter = {
        firstname: firstname,
        lastname: lastname,
        gender: gender,
        age: age,
        dob: dob
    };

    try {
        const update = await CharactersModel.update(updatedCharacter, query);
        res.status(200).json(update);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

//DELETE character
router.delete('/delete/:id', validateJWT, async (req, res) => {
    const owner_id = req.user.id;
    const character_id = req.params.id;

    try {
        const query = {
            where: {
                id: character_id,
                owner_id: owner_id
            },
        };

        await CharactersModel.destroy(query);
        res.status(200).json({ message: 'Character Removed' });
    } catch (err) {
        res.status(500).json({ error: err });
    }
})
module.exports = router;