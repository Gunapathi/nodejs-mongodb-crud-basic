const express = require('express');
const app = express();
const bodyParser = require('body-parser'); //get data from request body
const exhbs = require('express-handlebars'); //engine name

const dbObject = require('./db.js');
const ObjectID = dbObject.ObjectID;

app.engine('hbs', exhbs.engine({ layoutsDir: 'views/', defaultLayout: "main", extname: 'hbs' }))
app.set('view engine', 'hbs');
app.set('views', 'views')

app.use(bodyParser.urlencoded({ extended: true })); //middleware to get data from request body

app.get('/', async (req, res) => { //async function (waiting for db connection response)
    let database = await dbObject.getDatabase(); //returns a promise (db connection)
    const collection = database.collection('books'); //create a collection inside selected database
    const cursor = collection.find({})
    let books = await cursor.toArray(); // return a promise

    let message = '';
    let edit_id, edit_book;

    if (req.query.edit_id) {
        edit_id = req.query.edit_id;
        edit_book = await collection.findOne({ _id: new ObjectID(edit_id) });
    }

    switch (req.query.status) {
        case '1':
            message = 'Inserted new book';
            break;

        case '2':
            message = 'Updated Successfully';
            break;

        default:
            break;
    }

    res.render('main', { message, books, edit_id, edit_book })
})

app.post('/store_book', async (req, res) => {
    let database = await dbObject.getDatabase(); //returns a promise (db connection)
    const collection = database.collection('books'); //create a collection inside selected database

    let book = { name: req.body.title, author: req.body.author };
    await collection.insertOne(book);

    return res.redirect('/?status=1')
})

app.post('/update_book/:edit_id', async (req, res) => {
    let database = await dbObject.getDatabase(); //returns a promise (db connection)
    const collection = database.collection('books'); //create a collection inside selected database

    const editId = req.params.edit_id
    let book = { name: req.body.title, author: req.body.author };
    await collection.updateOne({ _id: new ObjectID(editId) }, { $set: book });

    return res.redirect('/?status=2')
})

const portId = 8000;

app.listen(portId, () => console.log(`listening to ${portId} port`))
