const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { 
    // Check if the username exists in the users array
    let userswithname = users.filter((user) => user.username === username);
    return userswithname.length > 0;
};

const authenticatedUser = (username, password) => { 
    // Check if the username and password match
    const validUsers = users.filter((user) => user.username === username && user.password === password);
    return validUsers.length > 0;
};


//only registered users can login
regd_users.post("/login", (req, res) => {
    console.log("Login attempt:", req.body);

    const { username, password } = req.body;
  
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password required" });
    }
  
    if (authenticatedUser(username, password)) {
      let accessToken = jwt.sign({ data: username }, "access", { expiresIn: 60 * 60 });
      req.session.authorization = { accessToken, username };
      return res.status(200).json({ message: "Login successful" });
    } else {
      return res.status(403).json({ message: "Invalid login. Check username and password." });
    }
  });
  
  

// Add a book review
// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session.authorization.username; // Get the username from the session

    if (!review) {
        return res.status(400).json({ message: "Review content required" });
    }

    // Check if the book exists
    const book = books[isbn];
    if (book) {
        // Initialize reviews if not present
        if (!book.reviews) {
            book.reviews = {};
        }

        // If the user has already posted a review, modify it
        if (book.reviews[username]) {
            book.reviews[username] = review;
            return res.status(200).json({ message: "Review modified successfully" });
        } else {
            // Otherwise, add the review
            book.reviews[username] = review;
            return res.status(200).json({ message: "Review added successfully" });
        }
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

// Delete a book review
// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization?.username; // Get the username from the session

    // Check if the book exists
    const book = books[isbn];
    if (book && book.reviews) {
        // Check if the user has posted a review
        if (book.reviews[username]) {
            delete book.reviews[username];
            return res.status(200).json({ message: "Review deleted successfully" });
        } else {
            return res.status(404).json({ message: "No review found for the user" });
        }
    } else {
        return res.status(404).json({ message: "Book or reviews not found" });
    }
});



module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
