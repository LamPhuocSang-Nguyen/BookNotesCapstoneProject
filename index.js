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
    const ISBN = "0385472579";
    const size = "M.jpg";
    try {
        const response = await axios.get(`https://covers.openlibrary.org/b/isbn/${ISBN}-${size}`, { responseType: 'arraybuffer' });
        const base64Image = Buffer.from(response.data, 'binary').toString('base64');
        const imgSrc = `data:image/jpeg;base64,${base64Image}`;
        res.render("index.ejs", { data: imgSrc });
        //console.log(imgSrc);
    } catch (err) {
        console.log(err);
    }

});

 
app.listen(port, ()=> {
    console.log(`server is running on port ${port}`);
});