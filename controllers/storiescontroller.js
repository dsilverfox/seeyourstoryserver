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
        const userId = await req.user.id
        await models.StoriesModel.create({
            title: title,
            content: content,
            userId: userId
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

//VIEW ALL STORIES
router.get("/view", validateJWT, async (req, res) => {
    const { userId } = req.user.id;
    // console.log(req.user)
    try {
        const userStories = await models.StoriesModel.findAll({
            where: {
                userId: "fbbfe501-87aa-44e9-83d3-d6d4882f970e"
            }
        });
        res.status(200).json(userStories);
    } catch (err) {
        console.log(err)
        res.status(500).json(err);
    }
});

// VIEW ONE STORY

router.get('/view/:id', validateJWT, async (req, res) => {
    const { id } = req.user
    const story_id = req.params.id
    try {
        const storyPage = await models.StoriesModel.findAll({
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
            const id = req.user.id;

            const query = {
               where: {
                   id: id
               },
            };

            const updatedStory = {
                title:title,
                content: content,
                owner_id: owner_id
            };

            try {
                const update = await models.StoriesModel.update(updatedStory, query);
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