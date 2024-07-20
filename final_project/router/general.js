const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  var username=req.body.username;
  var password=req.body.password;
  if (!isValid(username)){
    return res.status(400).json({message: "Username already exists"});
  }
  else{
    users.push({username:username,password:password});
    return res.status(200).json({message: "User created",allUsers:users});
  }
});

// Get the book list available in the shop
let getBooksPromise = new Promise((resolve, reject) => {
  resolve(books);
});
public_users.get('/',function (req, res) {
  //Write your code here
  getBooksPromise.then((result) => {
    return res.status(200).json(JSON.stringify({books: result}));
  }

  );});

// Get book details based on ISBN
let getBookByISBN =(isbn)=>{
  return new Promise((resolve, reject) => {
    resolve(books[isbn]);
  });
}
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  getBookByISBN(req.params.isbn).then((result) => {
    return res.status(200).json(JSON.stringify({books: result}));
  }
);});
  
// Get book details based on author
let getBookByAuthor =(author)=>{
  return new Promise((resolve, reject) => {
    var resulted=Object.values(books).filter(book=>book.author==author);
    resolve(resulted);
  });
}
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  getBookByAuthor(req.params.author).then((result) => {
    return res.status(200).json(JSON.stringify({books: result}));
  }
);
});

// Get all books based on title

let getBookByTitle =(title)=>{
  return new Promise((resolve, reject) => {
    var resulted=Object.values(books).filter(book=>book.title==title);
    resolve(resulted);
  });
}
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  getBookByTitle(req.params.title).then((result) => {
    return res.status(200).json(JSON.stringify({books: result}));
  });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  var resulted=books[req.params.isbn].reviews;
  return res.status(200).json(JSON.stringify({reviews: resulted}));
});

module.exports.general = public_users;
