const jwt = require('jsonwebtoken');
const { models } = require('../models');



const validateJWT = async (req, res, next) => {
      const checkProcess = (auth) => {
        if(auth) {
            models.UsersModel.findOne({
                where:{
                    id: auth.id
                }
            })
            .then(user => {
                if(user.hasAdmin) {
                    next();
                } else {
                    res.status(401).json({
                        Message: "Not Authorized for Admin Routes"
                    })
                }

            })
        }
    }
    console.log("HEADERS", req.headers)
    if (req.method == 'OPTIONS') {
        next();
    } else if (req.headers.authorization && req.headers.authorization.includes('Bearer')) {
        const { authorization } = req.headers;
        console.log("AUTH", authorization);
        const payload = authorization ? jwt.verify(
            authorization.includes('Bearer') ? authorization.split(' ')[1] : authorization,
            process.env.JWT_SECRET
            ) : undefined;
            
            checkProcess(payload);
    } else {
        res.status(403).send({
            message: 'Forbidden'
        });
    };
};

module.exports = validateJWT;