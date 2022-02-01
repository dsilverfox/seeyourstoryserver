const express = require('express');
const router = express.Router();
const { models } = require('../models');
let validateJWT = require("../middleware/validate-session");

//Test Route
router.get('/practice', (req, res) => {
    res.send('Hey!! This is a practice route!')
});

//CREATE JOURNAL
router.post('/create', validateJWT, async (req, res) => {
    const { title, content } = req.body.journal
    try {
        await models.JournalModel.create({
            title: title,
            content: content,
        })
            .then(
                journal => {
                    res.status(201).json({
                        journal: journal,
                        message: 'journal created'
                    })
                }
            )
    } catch (err) {
        res.status(500).json({
            error: `Failed to Create Journal: ${err}`
        });
    };
});

//VIEW Journal
router.get('/view', validateJWT, async (req, res) => {
    const { id } = req.user
    try {
        const characterJournal = await models.JournalModel.findAll({
            where: {
                owner_id: id
            }
        })
        res.status(200).json(characterJournal);
    } catch (err) {
        res.status(500).json({ Error: err })
    }
})

//EDIT Journal
router.put("/update", validateJWT, async (req, res) => {
    const { title, content } = req.body.story;
    const owner_id = req.user.id;

    const query = {
        where: {
            owner_id: owner_id
        },
    };

    const updatedJournal = {
        title: title,
        content: content,
        owner_id: owner_id
    };

    try {
        const update = await models.JournalModel.update(updatedJournal, query);
        res.status(200).json(update);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

//DELETE Journal
router.delete('/delete/id', validateJWT, async (req, res) => {
    const owner_id = req.user.id;
    const journal_id = req.params.id;

    try {
        const query = {
            where: {
                id: journal_id,
                owner_id: owner_id
            },
        };

        await JournalModel.destroy(query);
        res.status(200).json({ message: 'Story Removed' });
    } catch (err) {
        res.status(500).json({ error: err });
    }
})

module.exports = router;