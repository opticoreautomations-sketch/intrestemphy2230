import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 3000;
const JWT_SECRET = process.env.JWT_SECRET || "physics-platform-secret";

// Initialize Database
const db = new Database("physics.db");
db.pragma("journal_mode = WAL");

// Setup Tables
db.exec(`
  CREATE TABLE IF NOT EXISTS profiles (
    id TEXT PRIMARY KEY,
    full_name TEXT,
    email TEXT UNIQUE,
    password TEXT,
    role TEXT DEFAULT 'student',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS content (
    type TEXT PRIMARY KEY,
    video_url TEXT,
    pdf_url TEXT,
    booklet_url TEXT,
    test_url TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id TEXT,
    content_type TEXT,
    views INTEGER DEFAULT 0,
    last_accessed DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, content_type),
    FOREIGN KEY(student_id) REFERENCES profiles(id)
  );

  -- Initial Content (4 Lessons)
  INSERT OR IGNORE INTO content (type) VALUES ('lesson1');
  INSERT OR IGNORE INTO content (type) VALUES ('lesson2');
  INSERT OR IGNORE INTO content (type) VALUES ('lesson3');
  INSERT OR IGNORE INTO content (type) VALUES ('lesson4');
`);

// Default Admin (Teacher)
const adminPassword = bcrypt.hashSync("admin123", 10);
db.prepare(`
  INSERT INTO profiles (id, full_name, email, password, role) 
  VALUES (?, ?, ?, ?, ?)
  ON CONFLICT(email) DO UPDATE SET password = excluded.password, role = 'teacher'
`).run("admin-id", "Admin Teacher", "admin@physics.com", adminPassword, "teacher");

const app = express();
app.use(express.json());

// File Upload Setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "uploads");
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Middleware: Auth
const authenticate = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// --- API Routes ---

// Auth: Signup
app.post("/api/auth/signup", async (req, res) => {
  const { full_name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const id = Math.random().toString(36).substring(2, 15);
  
  try {
    db.prepare("INSERT INTO profiles (id, full_name, email, password) VALUES (?, ?, ?, ?)")
      .run(id, full_name, email, hashedPassword);
    res.json({ message: "User created" });
  } catch (err: any) {
    res.status(400).json({ error: "Email already exists" });
  }
});

// Auth: Login
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const user: any = db.prepare("SELECT * FROM profiles WHERE email = ?").get(email);
  
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  
  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET);
  res.json({ token, user: { id: user.id, full_name: user.full_name, role: user.role, email: user.email } });
});

// Auth: Forgot Password (Mock)
app.post("/api/auth/forgot-password", (req, res) => {
  const { email } = req.body;
  const user = db.prepare("SELECT * FROM profiles WHERE email = ?").get(email);
  
  if (!user) {
    return res.status(404).json({ error: "Email not found" });
  }
  
  // In a real app, we would send an email with a token.
  // For this app, we'll just return success and allow reset.
  res.json({ message: "Reset instructions sent to your email (simulated)" });
});

// Auth: Reset Password
app.post("/api/auth/reset-password", async (req, res) => {
  const { email, newPassword } = req.body;
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  
  const result = db.prepare("UPDATE profiles SET password = ? WHERE email = ?")
    .run(hashedPassword, email);
    
  if (result.changes === 0) {
    return res.status(404).json({ error: "User not found" });
  }
  
  res.json({ message: "Password updated successfully" });
});

// User Profile
app.get("/api/auth/me", authenticate, (req: any, res) => {
  const user = db.prepare("SELECT id, full_name, email, role FROM profiles WHERE id = ?").get(req.user.id);
  res.json(user);
});

// Content: Get
app.get("/api/content/:type", authenticate, (req, res) => {
  const content = db.prepare("SELECT * FROM content WHERE type = ?").get(req.params.type);
  res.json(content);
});

// Content: Update (Teacher only)
app.post("/api/content", authenticate, (req: any, res) => {
  if (req.user.role !== "teacher") return res.status(403).json({ error: "Forbidden" });
  const { type, video_url, pdf_url, booklet_url, test_url } = req.body;
  
  db.prepare(`
    UPDATE content 
    SET video_url = ?, pdf_url = ?, booklet_url = ?, test_url = ?, updated_at = CURRENT_TIMESTAMP
    WHERE type = ?
  `).run(video_url, pdf_url, booklet_url, test_url, type);
  
  res.json({ message: "Content updated" });
});

// Progress: Track View
app.post("/api/progress/view", authenticate, (req: any, res) => {
  const { content_type } = req.body;
  db.prepare(`
    INSERT INTO progress (student_id, content_type, views) 
    VALUES (?, ?, 1)
    ON CONFLICT(student_id, content_type) DO UPDATE SET views = views + 1, last_accessed = CURRENT_TIMESTAMP
  `).run(req.user.id, content_type);
  res.json({ message: "View tracked" });
});

// Admin: Get Stats
app.get("/api/admin/stats", authenticate, (req: any, res) => {
  if (req.user.role !== "teacher") return res.status(403).json({ error: "Forbidden" });
  
  const totalStudents = db.prepare("SELECT COUNT(*) as count FROM profiles WHERE role = 'student'").get() as any;
  const totalViews = db.prepare("SELECT SUM(views) as count FROM progress").get() as any;
  const students = db.prepare("SELECT id, full_name, email, created_at FROM profiles WHERE role = 'student'").all();
  
  res.json({
    totalStudents: totalStudents.count,
    totalViews: totalViews.count || 0,
    students
  });
});

// Admin: Delete Student
app.delete("/api/admin/students/:id", authenticate, (req: any, res) => {
  if (req.user.role !== "teacher") return res.status(403).json({ error: "Forbidden" });
  db.prepare("DELETE FROM profiles WHERE id = ?").run(req.params.id);
  res.json({ message: "Student deleted" });
});

// Admin: Upload File
app.post("/api/admin/upload", authenticate, upload.single("file"), (req: any, res) => {
  if (req.user.role !== "teacher") return res.status(403).json({ error: "Forbidden" });
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({ url: fileUrl });
});

// --- Vite Integration ---
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
