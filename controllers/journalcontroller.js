const express = require('express');
const router = express.Router();
const { models } = require('../models');

//Test Route
router.get('/practice', (req, res) => {
    res.send('Hey!! This is a practice route!')
});

router.post('/create', async(req, res) => {
    const {title, content} = req.body.journal
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

module.exports = router;