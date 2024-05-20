import axios from "axios";
import bodyParser from "body-parser";
import express from "express";
import pg from "pg";


const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get("/", async (req, res) => {
    //const ISBN = "0385472579"
    //const size = "S.jpg";
    try{
        const response = await axios.get(`https://covers.openlibrary.org/b/isbn/ + ${ISBN} + '-' + ${size}`);
        res.render("index.ejs", {data: response.data});
        console.log(response.data);
    }
    catch(err){
        console.log(err);
    }

});

 
app.listen(port, ()=> {
    console.log(`server is running on port ${port}`);
});