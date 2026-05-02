const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Task 6: Register a new user
// Takes username and password from request body and adds to users array
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
// Returns the complete books object as JSON
public_users.get('/', function (req, res) {
  return res.status(200).json(JSON.stringify(books));
});

// Task 2: Get book by ISBN synchronously
// Retrieves ISBN from request params and returns matching book
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Task 3: Get books by author synchronously
// Gets all book keys, filters by matching author, returns array of matches
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
// Gets all book keys, filters by matching title, returns array of matches
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
// Returns the reviews object for the specified book ISBN
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Task 10: Get all books using async/await
// Creates a Promise that resolves with all books, then awaits the result
// Uses async/await pattern to handle the asynchronous operation
public_users.get('/async/books', async function (req, res) {
  try {
    // Wrap book retrieval in a Promise to simulate async behavior
    const getBooksPromise = new Promise((resolve, reject) => {
      if (books) {
        resolve(books);
      } else {
        reject("No books found");
      }
    });
    // Await the promise resolution before sending response
    const allBooks = await getBooksPromise;
    return res.status(200).json(allBooks);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books", error: error.message });
  }
});

// Task 11: Get book by ISBN using Promise callbacks
// Creates a Promise that resolves if book exists, rejects if not found
// Uses .then() and .catch() callbacks to handle success and failure
public_users.get('/async/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  // Create a new Promise to retrieve book by ISBN
  const getBookByISBN = new Promise((resolve, reject) => {
    const book = books[isbn];
    if (book) {
      resolve(book); // Book found - resolve with book data
    } else {
      reject("Book not found"); // Book not found - reject with error message
    }
  });
  // Handle Promise resolution with .then() and .catch() callbacks
  getBookByISBN
    .then(book => res.status(200).json(book))
    .catch(err => res.status(404).json({ message: err }));
});

// Task 12: Get books by author using Promise callbacks
// Filters all books by author name using Promise pattern
// Resolves with matching books array or rejects if none found
public_users.get('/async/author/:author', function (req, res) {
  const author = req.params.author;
  // Create a new Promise to retrieve books by author
  const getBooksByAuthor = new Promise((resolve, reject) => {
    // Get all book keys and filter by matching author
    const bookKeys = Object.keys(books);
    const matchingBooks = bookKeys.filter(key => books[key].author === author)
                                  .map(key => books[key]);
    if (matchingBooks.length > 0) {
      resolve(matchingBooks); // Matching books found - resolve with array
    } else {
      reject("No books found for this author"); // No matches - reject
    }
  });
  // Handle Promise with .then() for success and .catch() for errors
  getBooksByAuthor
    .then(books => res.status(200).json(books))
    .catch(err => res.status(404).json({ message: err }));
});

// Task 13: Get books by title using async/await
// Wraps title search in a Promise and uses async/await to handle it
// Filters all books by matching title and returns results
public_users.get('/async/title/:title', async function (req, res) {
  const title = req.params.title;
  try {
    // Create a Promise that filters books by title
    const getBooksByTitle = new Promise((resolve, reject) => {
      const bookKeys = Object.keys(books);
      const matchingBooks = bookKeys.filter(key => books[key].title === title)
                                    .map(key => books[key]);
      if (matchingBooks.length > 0) {
        resolve(matchingBooks); // Matching books found - resolve with array
      } else {
        reject("No books found for this title"); // No matches - reject
      }
    });
    // Await the Promise and send the resolved result
    const result = await getBooksByTitle;
    return res.status(200).json(result);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
});

module.exports.general = public_users;
