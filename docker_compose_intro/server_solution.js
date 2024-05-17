const express = require('express');
// Constants
const bodyParser = require('body-parser');

const { promisify } = require('util');

const hostname = '0.0.0.0';
const port = 8080;

// App
const app = express();

app.use(bodyParser.json());

// GET method route
app.get('/', function (req, res) {
    res.send('GET request to the homepage');
});
  
// POST method route
app.post('/', function (req, res) {
    res.send('POST request to the homepage');
});

// GET method route
app.get('/secret', function (req, res, next) {
    res.send('Never be cruel, never be cowardly. And never eat pears!');
    console.log('This is a console.log message.');
});

/*
Your implementation here 
*/

// // Connect to mongodb server
const MongoClient = require('mongodb').MongoClient;
// /* Your url connection to mongodb container */
const url = 'mongodb://mongodb:27017'

const dbName = 'mock_database';
const collectionName = 'users';

// GET method route
// Retrieve all documents in collection
app.get('/api/get/all', async function(req, res){
    try {
        const client = await MongoClient.connect(url);
        const dbo = client.db(dbName);
        const query = {};
        const result = await dbo.collection(collectionName).find(query).toArray();
        if (result.length > 0){
            res.status(200).send(result);
        } else {
            res.status(200).send("The collection is empty.");
        }
        client.close();
    } catch(err) {
        console.error(err);
        res.status(500).send("An error ocurred.");
    }
});

// GET method route
// Query by a certain field(s)
// ...
app.get('/api/get', async function(req, res) {
    try {
        const client = await MongoClient.connect(url);
        const dbo = client.db(dbName);
        const gender = req.query.gender;
        if (!gender) {
            res.status(400).send('Please provide a "gender" parameter.');
            return;
        }
        if (gender !== 'Male' && gender != 'Famele') {
            res.status(400).send('Invalid "gender" parameter. Allowed values are "Male" or "Famele".');
            return;
        }
        const query = { gender: gender };
        const result = await dbo.collection(collectionName).find(query).toArray();
        if (result.length > 0){
            res.status(200).send(result);
        } else {
            res.status(404).send('No documents found for the specified "gender" parameter.');
        }
        client.close();
    } catch(err) {
        console.error(err);
        res.status(500).send("An error ocurred.");
    }

});

/* PUT method. Modifying the message based on certain field(s). 
If not found, create a new document in the database. (201 Created)
If found, message, date and offset is modified (200 OK) */
app.put('/api/put', async function(req, res){
    const expectedFields = ['first_name', 'last_name', 'email', 'gender', 'address', 'card', 'married_status'];

    try {

        if (expectedFields.every(field => Object.keys(req.body).includes(field))) {
            const client = await MongoClient.connect(url);
            const dbo = client.db(dbName);
            const query = { email: req.body.email };
            const updateFields = req.body;
            const options = { upsert: true, returnOriginal: false };
            const result = await dbo.collection(collectionName).findOneAndUpdate(query, { $set: updateFields}, options);
            client.close();
            if (result.lastErrorObject.upserted){
                res.status(201).send('New document created.');
            } else {
                res.status(200).send("Document updated.");
            }
            client.close();
        } else {
            res.status(404).send('Missing fields in request body.');
        }
    } catch(err) {
        console.error(err);
        res.status(500).send("An error ocurred.");
    }
});

/* DELETE method. Modifying the message based on certain field(s).
If not found, do nothing. (204 No Content)
If found, document deleted (200 OK) */
app.delete('/api/delete', async function(req, res) {
    const email = req.body.email;

    MongoClient.connect(url)
        .then(async (client) => {
            const dbo = client.db(dbName);
            const query = { email: email };

            const result = await dbo.collection(collectionName).deleteOne(query);
            if (result.deletedCount === 1) {
                res.status(200).send("Document deleted.");
            } else {
                res.status(204).send();
            }
            client.close();
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("An error ocurred while deleting the document.");
        });
});

app.listen(port, hostname);
console.log(`Running on http://${hostname}:${port}`);

