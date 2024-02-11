const express = require('express');
const app = express();
const bodyParser = require('body-parser'); //get data from request body
const exhbs = require('express-handlebars'); //engine name

const dbObject = require('./db');
const BookModel = require('./models/bookModel');
// const ObjectID = dbObject.ObjectID;

// DATABASE CONNECTION STRING
dbObject.getDatabase();

app.engine('hbs', exhbs.engine({
    layoutsDir: 'views/',
    defaultLayout: "main",
    extname: 'hbs',
    runtimeOptions: {
        allowProtoMethodsByDefault: true,
        allowProtoPropertiesByDefault: true,
    }
}))
app.set('view engine', 'hbs');
app.set('views', 'views')

app.use(bodyParser.urlencoded({ extended: true })); //middleware to get data from request body

app.get('/', async (req, res) => { //async function (waiting for db connection response)
    // MONGO CLIENT SETUP
    // let database = await dbObject.getDatabase(); //returns a promise (db connection)
    // const collection = database.collection('books'); //create a collection inside selected database
    // const cursor = collection.find({})
    // let books = await cursor.toArray(); // return a promise

    // MONGOOSE SETUP
    let books = await BookModel.find({})

    let message = '';

    // EDIT BOOK
    let edit_id, edit_book;
    if (req.query.edit_id) {
        edit_id = req.query.edit_id;
        edit_book = await collection.findOne({ _id: new ObjectID(edit_id) });
    }

    // DELETE BOOK
    if (req.query.delete_id) {
        delete_id = req.query.delete_id;
        await collection.deleteOne({ _id: new ObjectID(delete_id) });

        return res.redirect('/?status=3')
    }

    switch (req.query.status) {
        case '1':
            message = 'Inserted new book';
            break;

        case '2':
            message = 'Updated Successfully';
            break;

        case '3':
            message = 'Deleted Successfully';
            break;

        default:
            break;
    }

    res.render('main', { message, books, edit_id, edit_book })
})

app.post('/store_book', async (req, res) => {
    // MONGO CLIENT SETUP
    // let database = await dbObject.getDatabase(); //returns a promise (db connection)
    // const collection = database.collection('books'); //create a collection inside selected database

    // let book = { name: req.body.title, author: req.body.author };
    // await collection.insertOne(book);

    // MONGOOSE SETUP
    const book = new BookModel({ name: req.body.title, author: req.body.author });
    book.save(); // works same as insertOne() on a above code

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
