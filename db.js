const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const ObjectID = mongodb.ObjectId;

let database;

async function getDatabase() {
    // const client = MongoClient.connect('mongodb://localhost:27017');
    const client = await MongoClient.connect('mongodb://127.0.0.1:27017'); //await is used since it returns a promise
    database = client.db('library'); // check for db and connect or create a new database

    if (!database)
        console.log('Database not found')

    return database;
}

module.exports = { getDatabase, ObjectID }