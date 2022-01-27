const express = require('express');
const router = express.Router();
const { models } = require('../models');
let validateJWT = require("../middleware/validate-session");


//Test Route
router.get('/practice', (req, res) => {
    res.send('Hey!! This is a practice route!')
});

//Create Story
router.post('/create', validateJWT, async (req, res) => {
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

//VIEW STORY
router.get('/view', validateJWT, async(req, res) => {
        const{id}= req.user
        try {
            const userStory = await StoriesModel.findAll({
                where: {
                    owner_id: id
                }
            })
            res.status(200).json(userStory);
            } catch(err) {
                res.status(500).json({Error: err})
            }
        })

// VIEW ONE character

router.get('/view/:id', validateJWT, async (req, res) => {
    const { id } = req.user
    const story_id = req.params.id
    try {
        const storyPage = await StoriesModel.findAll({
            where: {
                owner_id: id,
                story_id: story_id
            }
        })
        res.status(200).json(storyPage);
    } catch (err) {
        res.status(500).json({ Error: err })
    }
})
//EDIT STORY
router.put("/update", validateJWT, async (req, res) => {
            const {title, content} = req.body.story;
            const owner_id = req.user.id;

            const query = {
               where: {
                   owner_id: owner_id
               },
            };

            const updatedStory = {
                title:title,
                content: content,
                owner_id: owner_id
            };

            try {
                const update = await StoriesModel.update(updatedStory, query);
                res.status(200).json(update);
            } catch(err) {
                res.status(500).json({error:err});
            }
        });

//DELETE STORY
router.delete('/delete/id', validateJWT, async (req, res) => {
            const owner_id = req.user.id;
            const story_id = req.params.id;

            try{
                const query = {
                    where: {
                        id: story_id,
                        owner_id: owner_id
                    },
                };

                await StoriesModel.destroy(query);
                res.status(200).json({message: 'Story Removed'});
            } catch(err) {
                res.status(500).json({error: err});
            }
        })
module.exports = router;