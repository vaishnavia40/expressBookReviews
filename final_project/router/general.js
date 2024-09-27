const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here

  return res.send(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn=req.params.isbn;
  
  if (books[isbn]) {
    return res.send(books[isbn]);
  }else{
    return res.status(404).send({ message: 'Book not found' });
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author=req.params.author;
  const bookDetails = Object.values(books).filter(book => book.author === author);
  if(bookDetails.length>0){
    return res.send(bookDetails);
  }else{
    return res.status(404).json({message: "author not found"});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title=req.params.title;
    const bookDetails = Object.values(books).filter(book => book.title === title);
    if(bookDetails.length>0){
      return res.send(bookDetails);
    }else{
      return res.status(404).json({message: "Title not found"});
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
    
    // Find the book corresponding to the given ISBN
    const book = books[isbn];
    
    // Check if the book exists
    if (book) {
        // Return the reviews of the book
        return res.send(book.reviews);
    } else {
        // If the book is not found, return a 404 error
        return res.status(404).json({ message: "Book not found" });
    }
});

module.exports.general = public_users;
