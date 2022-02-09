const express = require('express');
const router = express.Router();
const { models } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UniqueConstraintError } = require('sequelize/lib/errors');
let validateJWT = require("../middleware/validate-session");
let adminSession = require("../middleware/admin-session");

//Test Route -- Verified
router.get('/practice', (req, res) => {
    res.send('Hey!! This is a practice route!')
});

//USER SIGNUP -- Verified
router.post('/signup', async (req, res) => {

    const { username, password, hasAdmin } = req.body.user;
    try {
        await models.UsersModel.create({
            username: username,
            password: bcrypt.hashSync(password, 10),
            hasAdmin: hasAdmin
        })
            .then(
                user => {
                    let token = jwt.sign({ id: user.id, hasAdmin:user.hasAdmin }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 });
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

//USER LOGIN - Verified
router.post('/login', async (req, res) => {
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
                            let token = jwt.sign({ id: user.id, hasAdmin: user.hasAdmin}, process.env.JWT_SECRET, {expiresIn: 60*60*24})
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

//USER DELETE ACCOUNT - Verified (requires user ID and Bearer token IN POSTMAN)

router.delete('/delete', validateJWT, async (req, res) =>{
    const id = req.user.id;
    try {
    const query = {
        where: {
            id: id
        },
    };

    await models.UsersModel.destroy(query);
    res.status(200).json({message: "User Removed"});
    } catch (err) {
        console.log(err)
        res.status(500).json({error:err})
    }  
})


/**ADMIN ENDPOINTS**/
// Admin account has the ability to search all users and all of the posts stories and Characters. Admin has the right to delete any user.

//ADMIN VIEW ALL USERS VERIFIED

router.get('/userinfo', adminSession, async (req, res) => {
       try {
       const users = await models.UsersModel.findAll();

            if(users) {
                res.status(200).json({
                        users: users
                    });
                } else {
                    res.status(404).json({
                        message: "User not found."
                    })
                }
    } catch (err) {
        res.status(500).json({
            error: `Failed to retrieve users: ${err}`
        });
    };
});

//ADMIN DELETE USER -- VERIFIED (Requires Admin Bearer Token and ID manual enter.)
router.delete('/delete/:id', adminSession, async (req, res) => {
    const id = req.params.id;
    try {
        const query = {
            where: {
                id: id
            },
        };
        await models.UsersModel.destroy(query);
        res.status(200).json({ message: "User Removed" });
    } catch (err) {
        res.status(500).json({ error: err })
    } 
})
module.exports = router;