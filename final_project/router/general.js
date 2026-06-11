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

function getBooks() {
    return new Promise((resolve) => resolve(books));
}

// Task 2: get all books using async/await
public_users.get('/', async (req, res) => {
    try {
        const allBooks = await getBooks();
        return res.status(200).send(JSON.stringify(allBooks, null, 4));
    } catch (err) {
        return res.status(500).json({ message: "Error fetching books" });
    }
});

// Task 3: get book by ISBN using Axios + async/await
public_users.get('/isbn/:isbn', async (req, res) => {
    try {
        const isbn = req.params.isbn;
        const response = await axios.get(`http://localhost:5000/`);
        const allBooks = response.data;
        if (allBooks[isbn]) {
            return res.status(200).json(allBooks[isbn]);
        } else {
            return res.status(404).json({ message: "Book not found" });
        }
    } catch (err) {
        return res.status(500).json({ message: "Error fetching book by ISBN" });
    }
});

// Task 4: get books by author using Axios + async/await
public_users.get('/author/:author', async (req, res) => {
    try {
        const author = req.params.author;
        const response = await axios.get(`http://localhost:5000/`);
        const allBooks = response.data;
        const filtered = {};
        Object.keys(allBooks).forEach(key => {
            if (allBooks[key].author === author) filtered[key] = allBooks[key];
        });
        return res.status(200).send(JSON.stringify(filtered, null, 4));
    } catch (err) {
        return res.status(500).json({ message: "Error fetching books by author" });
    }
});

// Task 5: get books by title using Axios + async/await
public_users.get('/title/:title', async (req, res) => {
    try {
        const title = req.params.title;
        const response = await axios.get(`http://localhost:5000/`);
        const allBooks = response.data;
        const filtered = {};
        Object.keys(allBooks).forEach(key => {
            if (allBooks[key].title === title) filtered[key] = allBooks[key];
        });
        return res.status(200).send(JSON.stringify(filtered, null, 4));
    } catch (err) {
        return res.status(500).json({ message: "Error fetching books by title" });
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