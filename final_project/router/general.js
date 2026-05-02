const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Task 6: Register a new user
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res.status(404).json({ message: "Unable to register - username and password are required" });
  }
  if (isValid(username)) {
    return res.status(404).json({ message: "Username already exists" });
  }
  users.push({ username, password });
  return res.status(200).json({ message: "User successfully registered. Now you can login" });
});

// Task 1: Get all books synchronously
public_users.get('/', function (req, res) {
  return res.status(200).json(JSON.stringify(books));
});

// Task 2: Get book by ISBN synchronously
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Task 3: Get books by author synchronously
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const bookKeys = Object.keys(books);
  const matchingBooks = bookKeys.filter(key => books[key].author === author)
                                .map(key => books[key]);
  if (matchingBooks.length > 0) {
    return res.status(200).json(matchingBooks);
  } else {
    return res.status(404).json({ message: "No books found for this author" });
  }
});

// Task 4: Get books by title synchronously
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const bookKeys = Object.keys(books);
  const matchingBooks = bookKeys.filter(key => books[key].title === title)
                                .map(key => books[key]);
  if (matchingBooks.length > 0) {
    return res.status(200).json(matchingBooks);
  } else {
    return res.status(404).json({ message: "No books found for this title" });
  }
});

// Task 5: Get book reviews by ISBN synchronously
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Task 10: Get all books using async/await with Axios
// Uses async/await to make an Axios GET request to retrieve all books
// Awaits the Axios response and returns the book data to the client
public_users.get('/async/books', async function (req, res) {
  try {
    // Use Axios to make async GET request to the books endpoint
    const response = await axios.get('http://localhost:5000/');
    // Return the retrieved book data
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books", error: error.message });
  }
});

// Task 11: Get book by ISBN using Promise callback with Axios
// Uses Axios.get() which returns a Promise, then handles with .then() and .catch()
// The Promise resolves with book data or rejects with an error message
public_users.get('/async/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  // Axios GET returns a Promise - use .then() callback to handle response
  axios.get(`http://localhost:5000/isbn/${isbn}`)
    .then(response => {
      // Promise resolved - return the book data
      return res.status(200).json(response.data);
    })
    .catch(error => {
      // Promise rejected - return error message
      return res.status(404).json({ message: "Book not found", error: error.message });
    });
});

// Task 12: Get books by author using Promise callback with Axios
// Uses Axios.get() Promise with .then() and .catch() callbacks
// Filters books by author name and returns matching results
public_users.get('/async/author/:author', function (req, res) {
  const author = req.params.author;
  // Axios GET returns a Promise - chain .then() to process the response
  axios.get(`http://localhost:5000/author/${author}`)
    .then(response => {
      // Promise resolved - return the matching books data
      return res.status(200).json(response.data);
    })
    .catch(error => {
      // Promise rejected - return error message
      return res.status(404).json({ message: "No books found for this author", error: error.message });
    });
});

// Task 13: Get books by title using async/await with Axios
// Uses async/await with Axios GET request to retrieve books by title
// Awaits the Axios Promise and returns matching book data
public_users.get('/async/title/:title', async function (req, res) {
  const title = req.params.title;
  try {
    // Use Axios to make async GET request to the title endpoint
    const response = await axios.get(`http://localhost:5000/title/${encodeURIComponent(title)}`);
    // Return the retrieved books data
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(404).json({ message: "No books found for this title", error: error.message });
  }
});

module.exports.general = public_users;
