const express = require('express');
const router = express.Router();
const { models } = require('../models');
let validateJWT = require("../middleware/validate-session");

//Test Route
router.get('/practice', (req, res) => {
    res.send('Hey!! This is a practice route!')
});

//CREATE JOURNAL

router.post('/create/:characterId', validateJWT, async(req, res) => {
    const {title, content} = req.body.journal
    try {
        const characterId = req.params.characterId
        const userId = req.user.id
        const foundCharacter = await models.CharactersModel.findOne({
            where: {
                userId: userId,
                id: characterId
            }
        })    
         if(foundCharacter) {
        await models.JournalModel.create({
            title: title,
            content: content,
            characterId: characterId,
        })
        .then(
            journal => {
                res.status(201).json({
                    journal: journal,
                    message: 'journal created'
                })
            }
        ) } else {
            res.status(401).json({
                message: "Not Authorized"
            })
        }
    } catch (err) {
        res.status(500).json({
            error: `Failed to Create Journal: ${err}`
        });
    };
});

//VIEW Journal

router.get('/view/:characterId', validateJWT, async (req, res) => {
    const characterId = req.params.characterId
    console.log(characterId)
    try {
        const journalPage = await models.JournalModel.findOne({
            where: {
                characterId: characterId
                //keyword for endpoint must match the parameter
            }
        })
        res.status(200).json(journalPage);
    } catch (err) {
        res.status(500).json({ Error: err })
    }
})

//EDIT Journal

router.put("/update/:journalId", validateJWT, async (req, res) => {
    const {title, content} = req.body.journal
    const journalId = req.params.journalId

    const query = {
        where: {
            id: journalId
        },
    };

    const updatedJournal = {
        title: title,
        content: content,
    };

    try {
        const update = await models.JournalModel.update(updatedJournal, query);
        res.status(200).json(update);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

//DELETE Journal

router.delete('/delete/:journalId', validateJWT, async (req, res) => {
    const journalId = req.params.journalId;
    try {
        const query = {
            where: {
                id: journalId,
            },
        };

        await models.JournalModel.destroy(query);
        res.status(200).json({ message: 'Journal Removed' });
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err });
    }
})

module.exports = router;