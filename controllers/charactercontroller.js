const express = require('express');
const router = express.Router();
const { models } = require('../models');
let validateJWT = require("../middleware/validate-session");

//Test Route
router.get('/practice', (req, res) => {
    res.send('Hey!! This is a practice route!')
});

//CREATE CHARACTER
router.post('/create/:storyId', validateJWT, async (req, res) => {
    const { firstname, lastname, gender, age, dob} = req.body.characters
    try {
        const userId = await req.user.id
        await models.CharactersModel.create({
            firstname: firstname,
            lastname: lastname,
            gender: gender,
            age: age,
            dob: dob,
            userId: userId,
            storyId: req.params.storyId
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
    const userId = req.user.id
    try {
        const characterPage = await models.CharactersModel.findAll({
            where: {
                userId: userId
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
    try {
        const characterPage = await models.CharactersModel.findAll({
            where: {
                owner_id: id,
                character_id: req.params.id
            }
        })
        res.status(200).json(characterPage);
    } catch (err) {
        res.status(500).json({ Error: err })
    }
})

//EDIT character
router.put("/update/:characterId", validateJWT, async (req, res) => {
    const { firstname, lastname, gender, age, dob } = req.body.characters;
    const userId = req.user.id
    const characterId = req.params.characterId
    const query = {
        where: {
            userId: userId,
            id: characterId
            //keyword for endpoint must match the parameter
        }
    };

    const updatedCharacter = {
        firstname: firstname,
        lastname: lastname,
        gender: gender,
        age: age,
        dob: dob
    };

    try {
        const update = await models.CharactersModel.update(updatedCharacter, query);
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