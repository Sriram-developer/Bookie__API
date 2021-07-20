require("dotenv").config();

//Framework
const express = require("express");
const mongoose = require("mongoose");
//Database
const database = require("./database/index");

//Initializing express
const bookie = express();

// Configurations
bookie.use(express.json());

// Establish Database Connection
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
})
.then(() => console.log("connection established !!!"));

/*
Route         : /
Description   : get all books
Access        : public
parameters    : none
Method        : get
*/ 

bookie.get("/", (req, res) =>{
    return res.json({books: database.books});
});

/*
Route         : /is
Description   : get specific book based on ISBN
Access        : public
parameters    : isbn
Method        : get
*/ 

bookie.get("/is/:isbn", (req, res) =>{
     const getSpecificBook = database.books.filter(
         (book) => book.ISBN === req.params.isbn);

         if(getSpecificBook.length === 0){
             return res.json({
             error: `No book found for the ISBN of ${req.params.isbn}`,

             });
         }
         return res.json({ book: getSpecificBook});

});

/*
Route         : /c
Description   : get specific books based on a category
Access        : public
parameters    : category
Method        : get
*/ 

bookie.get("/c/:category" , (req, res) =>{
    const getSpecificBooks = database.books.filter(
        (book) => book.category.includes(req.params.category));

        if(getSpecificBooks.length === 0){
            return res.json({
            error: `No book found for the category of ${req.params.category}`,

            });
        }
        return res.json({ authors: getSpecificBooks});


});

/*
Route         : /a
Description   : get specific books based on author
Access        : public
parameters    : authors
Method        : get
*/ 

bookie.get("/a/:authors" , (req, res) =>{
    const getSpecificBooks = database.books.filter(
        (book) => book.authors.includes(parseInt(req.params.authors)));

        if(getSpecificBooks.length === 0){
            return res.json({
            error: `No book found for the author of ${req.params.authors}`,

            });
        }
        return res.json({ books: getSpecificBooks});


});

/*
Route         : /author
Description   : get all authors
Access        : public
parameters    : none
Method        : get
*/ 

bookie.get("/author", (req, res) =>{
    return res.json({authors: database.authors});
});

/*
Route         : not fixed
Description   : get specific author
Access        : public
parameters    : not fixed
Method        : get
*/ 

/*
Route         : /author
Description   : get a list of author based on a book's ISBN
Access        : public
parameters    : isbn
Method        : get
*/ 

bookie.get("/author/:isbn", (req,res) =>{
    const getSpecificAuthors = database.authors.filter((author) =>
       author.books.includes(req.params.isbn)
    );
    if(getSpecificAuthors.length === 0){
        return res.json({ error: `No author found for the book ${req.params.isbn}`});
    }

    return res.json({authors:getSpecificAuthors});

});

/*
Route         : /publications
Description   : get all publications
Access        : public
parameters    : none
Method        : get
*/ 

bookie.get("/publications",(req, res)=>{
    return res.json({publications: database.publications});
});

/*
Route         : not fixed
Description   : get specific publication 
Access        : public
parameters    : not fixed
Method        : get
*/ 

/*
Route         : not fixed
Description   : get a list of publications based on a book 
Access        : public
parameters    : not fixed
Method        : get
*/ 


/*******************POST*****************************************/


/*
Route         : /book/new
Description   : add new books
Access        : public
parameters    : none
Method        : post
*/ 

bookie.post("/book/new", (req, res) => {
    const {newBook} = req.body;
    database.books.push(newBook);

    return res.json({ books: database.books, message: "book was added !"});

});

/*
Route         : /author/new
Description   : add new author
Access        : public
parameters    : none
Method        : post
*/ 
bookie.post("/author/new", (req,res) =>{
    const {newAuthor} = req.body;
    database.authors.push(newAuthor);

    return res.json({ authors: database.authors, message: "author was added !"});


});

/*
Route         : /pub/new
Description   : add new author
Access        : public
parameters    : none
Method        : post
*/ 
bookie.post("/pub/new", (req,res) =>{
    const {newPublication} = req.body;
    database.publications.push(newPublication);

    return res.json({ publications: database.publications, message: "publication was added !"});


});

/************************PUT************************************************/

/*
Route         : /book/update
Description   : update title of a book (book details)
Access        : public
parameters    : isbn
Method        : put
*/ 

bookie.put("/book/update/:isbn", (req,res) =>{
    database.books.forEach((book) => {
        if(book.ISBN === req.params.isbn) {
            book.title = req.body.bookTitle;
            return;
        }
    });
    return res.json({ books: database.books});
});

/*
Route         : /book/author/update
Description   : update/add new author
Access        : public
parameters    : isbn
Method        : put
*/ 

bookie.put("/book/author/update:isbn", (req, res) =>{
    //update the book database
    database.books.forEach((book) =>{
        if(book.ISBN === req.params.isbn) 
        return book.authors.push(req.body.newAuthor);

    });

    //update the author database
    database.authors.forEach((author) =>{
        if(author.id === req.body.newAuthor)
        return author.books.push(req.params.isbn);
    });
    return res.json({ books: database.books, authors:database.authors, 
        message :"New author was added",
    });
});

/*
Route         : not fixed
Description   : update author detail
Access        : public
parameters    : not fixed
Method        : put
*/ 

/*
Route         : not fixed
Description   : update publication detail 
Access        : public
parameters    : not fixed
Method        : put
*/ 

/*
Route         : /publication/update/book
Description   : update/add new book to a publication 
Access        : public
parameters    : isbn
Method        : put
*/ 
bookie.put("/publication/update/book/:isbn", (req,res) => {
    //update the publication database
    database.publications.forEach((publication) =>{
        if(publication.id === req.body.pubId) {
            return publication.books.push(req.params.isbn);
        }      
    });
    //update the book database
    database.books.forEach((book) => {
        if(book.ISBN === req.params.isbn) {
            book.publication = req.body.pubId;
            return;
        }
    });
    return res.json({books: database.books, 
        publication: database.publications,
        message: "Sucessfully updated publication",
    });
});

/*********************************Delete********************************************/
/*
Route         : /book/delete
Description   : delete a book
Access        : public
parameters    : isbn
Method        : delete
*/ 

bookie.delete("/book/delete/:isbn", (req, res) => {
    
    const updatedBookDatabase = database.books.filter(
        (book) => book.ISBN !== req.params.isbn);
        database.books = updatedBookDatabase;
        return res.json({
            books: database.books 
        });

});

/*
Route         : /book/delete/author
Description   : delete a author from a book
Access        : public
parameters    : isbn , authorId
Method        : delete
*/ 
bookie.delete("/book/delete/author/:isbn/:authorId", (req, res) =>{
    
    //update the book database
    database.books.forEach((book) => {
      if(book.ISBN === req.params.isbn){
          const newAuthorList = book.authors.filter(
              (author) => author !== parseInt( req.params.authorId));
              book.authors = newAuthorList;
              return;
      }
    });
     
    //update the author database
    database.authors.forEach((author) =>{
        if(author.id === parseInt(req.params.authorId)){
            const newBookList = author.books.filter(
                (book) => book !== req.params.isbn);
                author.books = newBookList;
                return;
        }

    });
    return res.json({
        book: database.books,
        author: database.authors,
        message: "author was deleted !!!!!!",
    });
    
});

/*
Route         : not fixed
Description   : delete a author 
Access        : public
parameters    : not fixed
Method        : delete
*/ 

/*
Route         : /publication/delete/book
Description   : delete a book from publication
Access        : public
parameters    : isbn,publication id
Method        : delete
*/ 
bookie.delete("/publication/delete/book/:isbn/:pubId", (req, res) =>{
    //update publication database
    database.publications.forEach((publication) =>{
        if(publication.id === parseInt(req.params.pubId)){
            const newBooksList = publication.books.filter((book) => 
            book !== req.params.isbn);

            publication.books = newBookList;
            return;
        }
    });

    //update book database
    database.books.forEach((book) =>{
        if(book.ISBN === req.params.isbn){
            book.publication = 0; // no publication available
            return;
        }
    });
    return res.json ({books: database.books, publication: database.publications,
    });
});

/*
Route         : not fixed
Description   : delete publication
Access        : public
parameters    : notfixed 
Method        : delete
*/ 

bookie.listen(3000,() => console.log("server is running !!!")); 

