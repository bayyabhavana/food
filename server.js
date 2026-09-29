import express from "express";
import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// SQLite Database Setup
const db = new sqlite3.Database("users.db", (err) => {
  if (err) console.error("❌ DB connection error:", err.message);
  else console.log("✅ Connected to SQLite database");
});

db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL
)`);

// Registration Route
app.post("/register", (req, res) => {
  const { name, email, username, password } = req.body;

  if (!name || !email || !username || !password) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  const sql = `INSERT INTO users (name, email, username, password) VALUES (?, ?, ?, ?)`;
  db.run(sql, [name, email, username, password], function (err) {
    if (err) {
      if (err.code === "SQLITE_CONSTRAINT") {
        return res.status(409).json({ success: false, message: "Username or email already exists." });
      }
      console.error("❌ Insert error:", err.message);
      return res.status(500).json({ success: false, message: "Registration failed. Please try again." });
    }
    res.json({ success: true, message: "Registration successful!" });
  });
});

// Login Route
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  const sql = `SELECT id, name, email, username FROM users WHERE (username = ? OR email = ?) AND password = ?`;
  db.get(sql, [username, username, password], (err, row) => {
    if (err) {
      console.error("❌ Login error:", err.message);
      return res.status(500).json({ success: false, message: "Login failed. Please try again." });
    }
    if (!row) {
      return res.status(401).json({ success: false, message: "Invalid username/email or password." });
    }
    res.json({ success: true, user: row });
  });
});

// Catch-all route to serve the frontend
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});