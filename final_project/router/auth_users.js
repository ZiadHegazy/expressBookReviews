const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
const dotenv = require('dotenv');
dotenv.config();
let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  return users.filter(user=>user.username==username).length==0;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  return users.filter(user=>user.username==username && user.password==password).length==1;
}

//only registered users can login

   // replace with your own secret key

regd_users.post("/login", (req,res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if the user exists and the password is correct
  if (authenticatedUser(username, password)) {
    // Generate a JWT token
    const token = jwt.sign({ username }, process.env.SECRET_KEY);

    // Save the user credentials for the session
    req.session.user = { username, token };

    return res.status(200).json({ message: "Login successful", token });
  } else {
    return res.status(401).json({ message: "Invalid username or password" });
  }
});


regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.query;
  const { username,token } = req.session.user;

  // Find the book by ISBN
  const book = books[isbn];

  
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Find the user's existing review for the book
  const existingReview = Object.keys(book.reviews).includes(username)

  // If the user has an existing review, modify it
  if (existingReview) {
    book.reviews[username] = review;
    return res.status(200).json({ message: "Review modified successfully" });
  }

  // If the user does not have an existing review, add a new review
  book.reviews[username] = review;
  return res.status(200).json({ message: "Review added successfully" ,reviews:book.reviews});
});
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { username,token } = req.session.user;

  // Find the book by ISBN
  const book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Find the user's existing review for the book
  const existingReview = Object.keys(book.reviews).includes(username);

  // If the user has an existing review, delete it
  if (existingReview) {
    delete book.reviews[username];
    return res.status(200).json({ message: "Review deleted successfully",reviews:book.reviews });
  }

  return res.status(404).json({ message: "Review not found" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
