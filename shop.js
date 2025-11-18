const express = require("express");
const app = express();
const port = 3000;

app.use(express.json()); // Parse JSON body

// -------------------- Data --------------------
let books = [
  { id: 1, title: "Harry Potter", author: "J.K. Rowling", isbn: "9780747532699", review: "" },
  { id: 2, title: "The Alchemist", author: "Paulo Coelho", isbn: "9780061122415", review: "" },
  { id: 3, title: "To Kill a Mockingbird", author: "Harper Lee", isbn: "9780060935467", review: "" }
];

let users = [
  { username: "haripriya", email: "test@example.com", password: "harixx33" }
];

// -------------------- Task 1: Get all books --------------------
app.get("/books", (req, res) => {
  res.json(books);
});

// -------------------- Task 2: Get book by ISBN --------------------
app.get("/books/isbn/:isbn", (req, res) => {
  const book = books.find(b => b.isbn === req.params.isbn);
  if (!book) return res.status(404).json({ message: "Book not found" });
  res.json(book);
});

// -------------------- Task 3: Get books by author --------------------
app.get("/books/author/:author", (req, res) => {
  const results = books.filter(b => b.author.toLowerCase() === req.params.author.toLowerCase());
  if (results.length === 0) return res.status(404).json({ message: "No books found for this author" });
  res.json(results);
});

// -------------------- Task 4: Get books by title --------------------
app.get("/books/title/:title", (req, res) => {
  const results = books.filter(b => b.title.toLowerCase() === req.params.title.toLowerCase());
  if (results.length === 0) return res.status(404).json({ message: "No books found with this title" });
  res.json(results);
});

// -------------------- Task 5: Get a book review --------------------
app.get("/books/review/:isbn", (req, res) => {
  const book = books.find(b => b.isbn === req.params.isbn);
  if (!book) return res.status(404).json({ message: "Book not found" });
  res.json({ title: book.title, review: book.review || "No review yet" });
});

// -------------------- Task 6: Register new user --------------------
app.post("/register", (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) return res.status(400).json({ message: "All fields required" });
  const exists = users.find(u => u.username === username || u.email === email);
  if (exists) return res.status(400).json({ message: "User already exists" });
  users.push({ username, email, password });
  res.json({ message: "User registered successfully" });
});

// -------------------- Task 7: Login --------------------
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: "Username and password required" });
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ message: "Login successful" });
});

// -------------------- Task 8: Add/Modify book review --------------------
app.put("/books/review/:isbn", (req, res) => {
  const { username, review } = req.body;
  const book = books.find(b => b.isbn === req.params.isbn);
  if (!book) return res.status(404).json({ message: "Book not found" });
  book.review = `${username}: ${review}`;
  res.json({ message: "Review added/updated", book });
});

// -------------------- Task 9: Delete book review --------------------
app.delete("/books/review/:isbn", (req, res) => {
  const book = books.find(b => b.isbn === req.params.isbn);
  if (!book) return res.status(404).json({ message: "Book not found" });
  book.review = "";
  res.json({ message: "Review deleted", book });
});

// -------------------- Task 10: Async callback - Get all books --------------------
app.get("/books/async", async (req, res) => {
  const getAllBooks = () => new Promise(resolve => setTimeout(() => resolve(books), 500));
  const result = await getAllBooks();
  res.json(result);
});

app.get("/books/callback", (req, res) => {
  setTimeout(() => res.json(books), 500);
});

// -------------------- Task 11: Search book by ISBN using async/callback --------------------
app.get("/books/async/:isbn", async (req, res) => {
  const { isbn } = req.params;
  const book = await new Promise(resolve => setTimeout(() => resolve(books.find(b => b.isbn === isbn)), 500));
  if (!book) return res.status(404).json({ message: "Book not found" });
  res.json(book);
});

app.get("/books/callback/:isbn", (req, res) => {
  const { isbn } = req.params;
  setTimeout(() => {
    const book = books.find(b => b.isbn === isbn);
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json(book);
  }, 500);
});

// -------------------- Task 12: Search by Author async/callback --------------------
app.get("/books/async/author/:author", async (req, res) => {
  const { author } = req.params;
  const result = await new Promise(resolve => setTimeout(() => resolve(books.filter(b => b.author.toLowerCase() === author.toLowerCase())), 500));
  if (result.length === 0) return res.status(404).json({ message: "No books found for this author" });
  res.json(result);
});

app.get("/books/callback/author/:author", (req, res) => {
  const { author } = req.params;
  setTimeout(() => {
    const result = books.filter(b => b.author.toLowerCase() === author.toLowerCase());
    if (result.length === 0) return res.status(404).json({ message: "No books found for this author" });
    res.json(result);
  }, 500);
});

// -------------------- Task 13: Search by Title async/callback --------------------
app.get("/books/async/title/:title", async (req, res) => {
  const { title } = req.params;
  const result = await new Promise(resolve => setTimeout(() => resolve(books.filter(b => b.title.toLowerCase() === title.toLowerCase())), 500));
  if (result.length === 0) return res.status(404).json({ message: "No books found with this title" });
  res.json(result);
});

app.get("/books/callback/title/:title", (req, res) => {
  const { title } = req.params;
  setTimeout(() => {
    const result = books.filter(b => b.title.toLowerCase() === title.toLowerCase());
    if (result.length === 0) return res.status(404).json({ message: "No books found with this title" });
    res.json(result);
  }, 500);
});

// -------------------- Start server --------------------
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
