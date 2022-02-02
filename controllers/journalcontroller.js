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
     //const {title, content} = req.body.journal
     // TypeError: Cannot destructure property 'title' of 'req.body.journal' as it is undefined.
     // set title and content = req.journal.(title or content respectively) still returns error cannot read property title of undefined.
    const journalId = req.params.id
    const title = req.journal.title
    const content = req.journal.content
    console.log("Journal ID:", journalId)
    console.log("Title:", title)
    console.log("Content:", content)

    const query = {
        where: {
            journalId: journalId
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
        console.log(err);
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