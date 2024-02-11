const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const exhbs = require('express-handlebars'); //engine name

const dbObject = require('./db.js');

app.engine('hbs', exhbs.engine({ layoutsDir: 'views/', defaultLayout: "main", extname: 'hbs' }))
app.set('view engine', 'hbs');
app.set('views', 'views')

app.get('/', async (req, res) => { //async function (waiting for db connection response)
    let database = await dbObject.getDatabase(); //returns a promise (db connection)
    const collection = database.collection('books'); //create a collection inside selected database
    const cursor = collection.find({})
    let employees = await cursor.toArray(); // return a promise

    let message = '';
    res.render('main', { message, employees })
})

const portId = 8000;

app.listen(portId, () => console.log(`listening to ${portId} port`))
