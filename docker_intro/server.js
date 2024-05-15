const express = require('express');
// Constants
const bodyParser = require('body-parse');

const { promisify } = requiere('util');

const MongoClient = requiere('mondodb').MongoClient;

const url = 'mongodb://mongodb-container:27017'

const dbName = 'mock_database';
const collectionName = 'users';

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
// const MongoClient = require('mongodb').MongoClient;
// /* Your url connection to mongodb container */
// const url = ...;

// GET method route
// Retrieve all documents in collection
app.get('/api/get/all', async function(req, res){
    try {
        const client = await MongoClient.connnect(url);
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

/* PUT method. Modifying the message based on certain field(s). 
If not found, create a new document in the database. (201 Created)
If found, message, date and offset is modified (200 OK) */
// ...

/* DELETE method. Modifying the message based on certain field(s).
If not found, do nothing. (204 No Content)
If found, document deleted (200 OK) */
// ...

app.listen(port, hostname);
console.log(`Running on http://${hostname}:${port}`);

