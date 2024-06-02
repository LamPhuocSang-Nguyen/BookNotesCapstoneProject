import axios from "axios";
import bodyParser from "body-parser";
import { compile } from "ejs";
import express from "express";
import pg from "pg";


const app = express();
const port = 3000;

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "booknotes",
    password: "admin",
    port: 5432,
  });
  db.connect();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

let books = [];

/*async function getAllBooks()
{
    books = [];
    const result = await db.query("SELECT * FROM books");
    result.rows.forEach((book) => {
        books.push(book);
    });
}*/

async function getBase64Image(ISBN)
{
    const size = "M.jpg";
    const response = await axios.get(`https://covers.openlibrary.org/b/isbn/${ISBN}-${size}`, { responseType: 'arraybuffer' });
    const base64Image = Buffer.from(response.data, 'binary').toString('base64');
    return `data:image/jpeg;base64,${base64Image}`;
}

//get root
app.get("/", async (req, res) => {
    const sort = req.query.sort;
    try {
        if(sort === undefined)
        {
            books = [];
            const result = await db.query("SELECT * FROM books");
            result.rows.forEach((book) => {
                books.push(book);
            });
        }
        else if(sort === "title")
        {
            books = [];
            const result = await db.query("SELECT * FROM books ORDER BY title ASC");
            result.rows.forEach((book) => {
                books.push(book);
            });

        }
        else if(sort === "date")
        {
            books = [];
            const result = await db.query("SELECT * FROM books ORDER BY date_read DESC");
            result.rows.forEach((book) => {
                books.push(book);
            });
        }
        else
        {
            books = [];
            const result = await db.query("SELECT * FROM books ORDER BY rating DESC");
            result.rows.forEach((book) => {
                books.push(book);
            });
        }
        res.render("index.ejs", { listBooks: books });
    } catch (err) {
        console.log(err);
    }
});

//new-entry
app.get("/new-entry", (req, res) => {
    res.render("newbook.ejs");
});

//add a book
app.post("/addbook", async (req, res) =>{
    const add = req.body.add;
    const isbn = req.body.isbn;
    const title = req.body.title;
    const author = req.body.author;
    const description = req.body.description;
    const review = req.body.review;
    const rating = req.body.rating;
    const dateread = new Date();

    if(add === "Cancel")
    {
        res.redirect("/");
    }
    else
    {
        try{
            const imageSrc =  await getBase64Image(isbn);           
            const result = await db.query("INSERT INTO books(isbn, title, author, description, review, rating, date_read, base64image) VALUES($1,$2,$3,$4,$5,$6,$7,$8)",
             [isbn,title,author,description,review,rating,dateread,imageSrc]);

            if(result.rowCount > 0)
            {
                console.log("Adding is successfully");
            }
            else
            {
                console.log("Fail");
            }
            res.redirect("/");
        }catch(err){
            console.log(err);
        }
    }
});

//delete a book
app.post("/book/delete", async(req, res) =>{
    const bookid = parseInt(req.body.id);

    try
    {
        await db.query("DELETE FROM notes WHERE book_id = $1", [bookid]);
        await db.query("DELETE FROM books WHERE id = $1",[bookid]);
        res.redirect("/");
    }catch(err)
    {
        console.log(err);
    }
});


//update a new review
app.post("/review/update", async (req, res) => {
    const id = parseInt(req.body.id);
    const newReview = req.body.review;

    try
    {
        const result = await db.query("UPDATE books SET review = $1 WHERE id = $2", [newReview, id]);
        if(result.rowCount > 0)
        {
            console.log("update is successfully");
        }
        else
        {
            console.log("Fail");
        }
        res.redirect("/");
        console.log(req.body);
    }catch(err){
        console.log(err);
    }
}) 

//view list of my notes
app.get("/notes/view/:bookId", async (req, res) => {
    const book_id = parseInt(req.params.bookId);
    let data = [];
    try
    {
        const result = await db.query("SELECT notes.id as note_id, books.id, title, author, base64image, date_read, note FROM books LEFT JOIN notes ON books.id = notes.book_id WHERE books.id = $1", [book_id]);
        result.rows.forEach((object) => {
            data.push(object);
        });
        res.render("note.ejs", {data: data});
    }catch(err){
        console.log(err);
    }
});

//adding a new note
app.post("/notes/add", async (req, res) => {
    const note = req.body.note;
    const bookid = req.body.id;

    try
    {
        const result = await db.query("INSERT INTO notes(note, book_id) VALUES($1,$2)", [note, bookid]);
        if(result.rowCount > 0)
        {
            console.log("Adding note is successfully");
        }
        else
        {
            console.log("Fail");
        }
        res.redirect(`/notes/view/${bookid}`);//res.redirect reloads the page by hitting the GET route /notes/view/:bookId
    }catch(err){
        console.log(err);
    }
});

//updating a note
app.post("/notes/update", async (req, res) =>{
    const book_id = parseInt(req.body.book_id);
    const note_id = parseInt(req.body.note_id);
    const updateNote = req.body.updatenote;

    try
    {
        const result = await db.query("UPDATE notes SET note = $1 WHERE id = $2", [updateNote, note_id]);
        if(result.rowCount > 0)
        {
            console.log("update is successfully");
        }
        else
        {
            console.log("Fail");
        }
        res.redirect(`/notes/view/${book_id}`);//res.redirect reloads the page by hitting the GET route /notes/view/:bookId
    }catch(err)
    {
        console.log(err);
    }
});

//delete a note
app.post("/notes/delete", async(req, res) =>{
    const book_id = parseInt(req.body.book_id);
    const note_id = parseInt(req.body.note_id);

    try
    {
        await db.query("DELETE FROM notes WHERE id = $1", [note_id]);

        res.redirect(`/notes/view/${book_id}`);//res.redirect reloads the page by hitting the GET route /notes/view/:bookId
    }catch(err)
    {
        console.log(err);
    }
});


app.listen(port, ()=> {
    console.log(`server is running on port ${port}`);
});