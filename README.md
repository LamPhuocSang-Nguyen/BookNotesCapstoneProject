# My BookNotes project. 

# install nodejs by using commant:
1. npm i 
2. npm i nodemon

# run project
nodemon index.js

# Entity tables database
![Reference image](public/screenshort/EntityTable.PNG)

# API Interaction
* When submitting a new book entry, cover images are fetched from the [Open Library Covers API](https://openlibrary.org/dev/docs/api/covers) using Axios. A `getBase64Image` function fetches the image and save them to DBMS.

# Access the website in your browser
`http://localhost:3000`

# Some pictures from my page 
1. Header of the page
![Reference image](public/screenshort/homeBooks.PNG)
2. Book entries with `View Notes`, `Delete Book`, `Update Review` features
![Reference image](public/screenshort/content.PNG)
3. Adding a new book with the information of the book
![Reference image](public/screenshort/newbook.PNG)
4. Notes listing including `Add Note`, `Update Note`, `Delete Note` features
 ![Reference image](public/screenshort/viewnote.PNG)