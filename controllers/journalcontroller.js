const express = require('express');
const router = express.Router();
const { models } = require('../models');

router.post('/journal', async(req, res) => {
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