const router = require('express').Router();
const { models } = require('../models');

router.post('/stories', async (req, res) => {
    const { title, content } = req.body.stories
    try {
        await models.StoriesModel.create({
            title: title,
            content: content,
        })
            .then(
                stories => {
                    res.status(201).json({
                        stories: stories,
                        message: 'Story created'
                    })
                }
            )
    } catch (err) {
        res.status(500).json({
            error: `Failed to Create Story: ${err}`
        });
    };
});

module.exports = router;