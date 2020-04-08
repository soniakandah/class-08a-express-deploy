'use strict';

const express = require('express');

let data = require('../in-class-db.json');
const notFound = require('./middleware/404.js');
const timestamp = require('./middleware/timestamp.js');
const logger = require('./middleware/logger.js');
const serverError = require('./middleware/500.js');
const generateSwagger = require('../docs/swagger.js');

// Define our server as "app"
// express() creates a server object with a lot of junk
const app = express();

generateSwagger(app);

// Application Middleware
app.use(express.json());
app.use(timestamp);
app.use(logger);

const startServer = (port) => {
    // check is server already running?
    // check if port is valid

    // call callback anon function when server is successfully running
    app.listen(port, () => {
        console.log('Server is up and running on port', port);
    });
};

/**
 * This route gives you a standard "Homepage" message
 * @route GET /
 * @param {string} name.query - a name field which adds a welcome message
 * @returns {object} 200 - The HTML to show on the homepage
 */
app.get('/', (req, res, next) => {
    let homeHTML = '<div><h1>Homepage</h1>';

    if (req.query.name)
        homeHTML += '<h3>Welcome ' + req.query.name + '!</h3></div>';
    else homeHTML += '</div>';

    // return res to the client
    res.status(200);
    res.send(homeHTML);
});

app.get('/throw-err', (req, res, next) => {
    next('this is my error');
});

/**
 * This route allows you to create a fruit
 * @route POST /fruits
 * @group fruits
 * @returns {object} 201 - The created object
 * @returns {Error} - If there was an issue creating in the db
 */
app.post('/fruits', (req, res, next) => {
    // what we want to make
    // is probably in req.body

    // get the object from req.body (it probably won't have id)
    let newFruit = req.body;

    // add the id key value by setting the id equal to
    // the number of fruits + 1
    newFruit.id = data.fruits.length + 1;

    // push this new fruit to our in-memory data ("save" the record)
    data.fruits.push(newFruit);

    // send the new record we created back to client to verify
    res.status(201);
    res.send(newFruit);
});

// Read - GET
app.get(
    '/fruits',
    (req, res, next) => {
        console.log('attempting to get fruits');
        next();
    },
    (req, res, next) => {
        console.log('continuing the attempt');
        next();
    },
    (req, res, next) => {
        res.send(data.fruits);
    },
);

/**
 * This route allows you to update a fruit
 * @route PUT /fruits/{id}
 * @group fruits
 * @param {Number} id.path - the id of the field you want to update
 * @returns {object} 200 - The updated object
 * @returns {Error} - If there was an issue updating in the db
 */
app.put(
    '/fruits/:id',
    (req, res, next) => {
        // the goal of put
        // a full update - we usually are given the ENTIRE object
        // all the key values, this is a full find-replace
        // the request should send me the "new" record
        // in request.body
        // { name: 'red apple', count: 15 }

        if (req.params.id > data.fruits.length) {
            next();
            return;
        }

        console.log('SHOULD NOT BE HERE IF ID > 3');

        // full replace foundRecord with request.body
        let modifiedRecord = req.body;
        modifiedRecord.id = req.params.id;

        // replace in database
        data.fruits[req.params.id - 1] = modifiedRecord;
        res.send(modifiedRecord);
    },
    notFound,
);

app.patch('/fruits/:id', (req, res, next) => {
    // the goal of patch
    // a merge-update - we are given pieces of the object
    // some key-values, and we want to merge with existing
    // record, replacing ONLY the keys that are duplicates

    // in request.body
    // { count: 15 }

    // find existing record
    let foundRecord = data.fruits[req.params.id - 1];

    // merge with req.body
    let modifiedRecord = { ...foundRecord, ...req.body };

    // replace in database
    data.fruits[req.params.id - 1] = modifiedRecord;
    res.send(modifiedRecord);
});

// Delete - DELETE
app.delete('/fruits/:id', (req, res, next) => {
    let fruits = data.fruits;

    data.fruits = fruits.filter((val) => {
        if (val.id === parseInt(req.params.id)) return false;
        else return true;
    });

    res.send(data.fruits);
});

// Categories Routes
// Create - POST
app.post('/vegetables', (req, res, next) => {});

// Read - GET
app.get('/vegetables', (req, res, next) => {});

// Update - PUT/PATCH
app.put('/vegetables/:id', (req, res, next) => {});

// Delete - DELETE
app.delete('/vegetables/:id', (req, res, next) => {});

app.use('*', notFound);
app.use(serverError);

module.exports = {
    server: app,
    start: startServer,
};
