
const express = require("express");
const fs = require("fs");
const cors = require("cors");
const bcrypt = require("bcrypt");
const app = express();
const saltRounds = 10;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const DB_FILE = "users.json";
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify({ users: [], transactions: [] }, null, 2));
}

function readDB() { return JSON.parse(fs.readFileSync(DB_FILE, "utf-8")); }
function writeDB(data) { fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2)); }


app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  const db = readDB();

  if (db.users.some(u => u.username === username || u.email === email)) {
    return res.json({ success: false, message: "User already exists" });
  }

  const hashed = await bcrypt.hash(password, saltRounds);
  db.users.push({ username, email, password: hashed });
  writeDB(db);

  res.json({ success: true, message: "Account created!" });
});


app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const db = readDB();
  const user = db.users.find(u => u.username === username);
  if (user && await bcrypt.compare(password, user.password)) {
    res.json({ success: true, user: { username: user.username, email: user.email } });
  } else {
    res.json({ success: false, message: "Wrong credentials" });
  }
});

app.post("/get-transactions", (req, res) => {
  const { email } = req.body;
  const db = readDB();
  res.json({ success: true, data: db.transactions.filter(t => t.email === email) });
});

app.post("/add-transaction", (req, res) => {
  const { email, amount, type, category, status } = req.body;
  const db = readDB();
  db.transactions.push({
    _id: Date.now().toString(),
    email, amount: Number(amount), type, category, status,
    date: new Date().toISOString()
  });
  writeDB(db);
  res.json({ success: true });
});

app.post("/delete-transaction", (req, res) => {
  const { id, email } = req.body;
  const db = readDB();
  db.transactions = db.transactions.filter(t => !(t._id === id && t.email === email));
  writeDB(db);
  res.json({ success: true });
});

app.listen(5000, () => console.log("Server running → http://localhost:5000"));