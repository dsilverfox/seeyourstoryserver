require('dotenv').config();

// imports
const express = require('express');
const dbConnection = require('./db');
const controllers = require('./controllers');
const middleware = require('./middleware');

// instantiation
const app = express();

// middleware
app.use(middleware.CORS);
app.use(express.json());

// endpoints
app.use('/auth', controllers.userscontroller);

// app.use(middleware.validateSession);
app.use('/characters', controllers.charactercontroller);
app.use('/journal', controllers.journalcontroller);
app.use('/story', controllers.storiescontroller);

dbConnection.authenticate()
    .then(() => dbConnection.sync())
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`[Server]: App is listening on ${process.env.PORT}.`)
        })
    })
    .catch((err) => {
        console.log(`[Server]: Server crashed. Error = ${err}`)
    })

/*{force: true}*/