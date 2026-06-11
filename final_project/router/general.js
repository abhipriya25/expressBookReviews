const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios');
const public_users = express.Router();

// Task 7: register
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(404).json({ message: "Unable to register user. Username/password missing" });
    }
    if (isValid(username)) {
        return res.status(404).json({ message: "User already exists!" });
    }
    users.push({ username, password });
    return res.status(200).json({ message: "User successfully registered. Now you can login" });
});

// Task 2: get all books (async/await)
public_users.get('/', async (req, res) => {
    try {
        const getBooks = () => new Promise((resolve) => resolve(books));
        const allBooks = await getBooks();
        return res.status(200).send(JSON.stringify(allBooks, null, 4));
    } catch (err) {
        return res.status(500).json({ message: "Error fetching books" });
    }
});

// Task 3: get book by ISBN (Promise)
public_users.get('/isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    new Promise((resolve, reject) => {
        if (books[isbn]) resolve(books[isbn]);
        else reject("Book not found");
    })
    .then(book => res.status(200).json(book))
    .catch(err => res.status(404).json({ message: err }));
});

// Task 4: get books by author (async/await)
public_users.get('/author/:author', async (req, res) => {
    try {
        const author = req.params.author;
        const result = await new Promise((resolve) => {
            const filtered = {};
            Object.keys(books).forEach(key => {
                if (books[key].author === author) filtered[key] = books[key];
            });
            resolve(filtered);
        });
        return res.status(200).send(JSON.stringify(result, null, 4));
    } catch (err) {
        return res.status(404).json({ message: "Author not found" });
    }
});

// Task 5: get books by title (async/await)
public_users.get('/title/:title', async (req, res) => {
    try {
        const title = req.params.title;
        const result = await new Promise((resolve) => {
            const filtered = {};
            Object.keys(books).forEach(key => {
                if (books[key].title === title) filtered[key] = books[key];
            });
            resolve(filtered);
        });
        return res.status(200).send(JSON.stringify(result, null, 4));
    } catch (err) {
        return res.status(404).json({ message: "Title not found" });
    }
});

// Task 6: get book reviews
public_users.get('/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.status(200).json(books[isbn].reviews);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

module.exports.general = public_users;