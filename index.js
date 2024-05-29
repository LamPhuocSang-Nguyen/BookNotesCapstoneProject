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

async function getAllBooks()
{
    books = [];
    const result = await db.query("SELECT * FROM books");
    result.rows.forEach((book) => {
        books.push(book);
    });
}

async function getBase64Image(ISBN)
{
    const size = "M.jpg";
    const response = await axios.get(`https://covers.openlibrary.org/b/isbn/${ISBN}-${size}`, { responseType: 'arraybuffer' });
    const base64Image = Buffer.from(response.data, 'binary').toString('base64');
    return `data:image/jpeg;base64,${base64Image}`;
}

//get root
app.get("/", async (req, res) => {
    try {
        await getAllBooks();
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

 
app.listen(port, ()=> {
    console.log(`server is running on port ${port}`);
});