// MONGO CLIENT DATABASE SETUP - REFERENCES
// const mongodb = require('mongodb');
// const MongoClient = mongodb.MongoClient;
// const ObjectID = mongodb.ObjectId;

// MONGOOSE DATABASE SETUP
const mongoose = require('mongoose');

let database;

async function getDatabase() {
    // MONGO CLIENT DATABASE SETUP - REFERENCES
    // const client = await MongoClient.connect('mongodb://127.0.0.1:27017'); //await is used since it returns a promise
    // database = client.db('library'); // check for db and connect or create a new database

    // if (!database)
    //     console.log('Database not found')

    // return database;

    // MONGOOSE DATABASE SETUP
    mongoose.connect('mongodb://127.0.0.1:27017/library')
        .then(() => {
            console.log('Database connected');
        }).catch((err) => {
            console.log('Error connecting to Mongo', err);
        })
}

module.exports = {
    getDatabase,
    // ObjectID
}