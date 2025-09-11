const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = 5000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public"))); // serve frontend

// Connect to SQLite DB
const db = new sqlite3.Database("users.db", (err) => {
  if (err) console.error("❌ DB connection error:", err.message);
  else console.log("✅ Connected to SQLite database");
});

// Create table if not exists
db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL
)`);

// Register route
app.post("/register", (req, res) => {
  console.log("📩 Register request body:", req.body);

  const { name, email, username, password } = req.body;
  if (!name || !email || !username || !password) {
    return res.json({ success: false, message: "All fields required" });
  }

  const sql = `INSERT INTO users (name, email, username, password) VALUES (?, ?, ?, ?)`;
  db.run(sql, [name, email, username, password], function (err) {
    if (err) {
      console.error("❌ Insert error:", err.message);
      return res.json({ success: false, message: "User already exists or DB error" });
    }
    console.log("✅ Inserted user with ID:", this.lastID);
    return res.json({ success: true, message: "Registration successful!" });
  });
});

// Login route
app.post("/login", (req, res) => {
  console.log("📩 Login request body:", req.body);

  const { username, password } = req.body;
  const sql = `SELECT * FROM users WHERE (username = ? OR email = ?) AND password = ?`;

  db.get(sql, [username, username, password], (err, row) => {
    if (err) {
      console.error("❌ Login error:", err.message);
      return res.json({ success: false, message: "Database error" });
    }
    if (!row) {
      console.warn("⚠️ Invalid login attempt for:", username);
      return res.json({ success: false, message: "Invalid username/email or password" });
    }
    console.log("✅ Login success:", row.username);
    return res.json({ success: true, user: row });
  });
});

// Catch-all route for frontend (must be LAST)
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
