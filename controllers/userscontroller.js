const express = require('express');
const router = express.Router();
const { models } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UniqueConstraintError } = require('sequelize/lib/errors');
let validateJWT = require("../middleware/validate-session");


//Test Route
router.get('/practice', (req, res) => {
    res.send('Hey!! This is a practice route!')
});

//USER SIGNUP
router.post('/signup', async (req, res) => {
    const { username, password } = req.body.user;
    try {
        await models.UsersModel.create({
            username: username,
            password: bcrypt.hashSync(password, 10)
        })
            .then(
                user => {
                    let token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 });
                    res.status(201).json({
                        user: user,
                        message: 'user created',
                        sessionToken: `Bearer ${token}`
                    });
                }
            )
    } catch (err) {
        if (err instanceof UniqueConstraintError) {
            res.status(409).json({
                message: "Username is already in use."
            });
        } else {
            res.status(500).json({
                error: `Failed to register user: ${err}`
            });
        };
    };

});

//USER LOGIN
router.post('/login', validateJWT, async (req, res) => {
    const {username, password} = req.body.user;

    try{
        await models.UsersModel.findOne({
            where: {username: username}
        })
        .then(
            user => {
                if (user) {
                    bcrypt.compare(password, user.password,(err, matches)=>{
                        if(matches) {
                            let token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: 60*60*24})
                            res.json({
                                user: user,
                                message: 'logged in',
                                sessionToken: `Bearer ${token}`
                            })
                        } else {
                            res.status(502).send({
                                error: 'Bad Gateway'
                            })
                        }
                    })
                } else {
                    res.status(500).send ({
                        error: 'Failed to Authenticate'
                    })
                }
            }
        )
    } catch (err) {
        res.status(501).send ({
            error: "server does not support this functionality."
        })
    }
})

//USER VIEW ACCOUNT
router.get('/view', validateJWT, async (req, res) => {
    const { id } = req.user
    try {
        const userProfile = await UsersModel.findAll({
            where: {
                owner_id: id
            }
        })
        res.status(200).json(userProfile);
    } catch (err) {
        res.status(500).json({ Error: err })
    }
})
//USER EDIT PROFILE

router.put("/update", validateJWT, async (req, res) => {
    const { username } = req.body.user;
    const owner_id = req.user.id;

    const query = {
        where: {
            owner_id: owner_id
        },
    };

    const updatedUser = {
        username: username,
    };

    try {
        const update = await UsersModel.update(updatedUser, query);
        res.status(200).json(update);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

//USER DELETE ACCOUNT

router.delete('/delete/:id', validateJWT, async (req, res) =>{
    const id = req.user.id;
    try {
    const query = {
        where: {
            id: id
        },
    };
    await UsersModel.destroy(query);
    res.status(200).json({message: "User Removed"});
    } catch (err) {
        res.status(500).json({error:err})
    }  
})

/**ADMIN ENDPOINTS**/
// Admin account has the ability to search all users and all of the posts stories and Characters. Admin has the right to delete any user.

//Admin View All Users (needs validation for admin rights.)
router.get('/userinfo', async (req, res) => {
    try {
        await models.UsersModel.findAll({
            include: [{
                model: models.CharactersModel,
                include: [{
                    model: models.JournalModel
                }],
            }],
            include: [{
                model: models.StoriesModel
            }]
        })
            .then(
                users => {
                    res.status(200).json({
                        users: users
                    });
                }
            )
    } catch (err) {
        res.status(500).json({
            error: `Failed to retrieve users: ${err}`
        });
    };
});

//ADMIN DELETE USER
router.delete('/delete/:id', validateJWT, async (req, res) => {
    const id = req.user.id;
    try {
        const query = {
            where: {
                id: id
            },
        };
        await UsersModel.destroy(query);
        res.status(200).json({ message: "User Removed" });
    } catch (err) {
        res.status(500).json({ error: err })
    }
})
module.exports = router;