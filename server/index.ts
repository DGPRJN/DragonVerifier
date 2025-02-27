import express from "express";
import {prisma, connectDB} from "./db.js"; // Import the database connection

const app = express();
const port = 3001;

connectDB(); // Connect to MongoDB

app.get("/", (req, res) => {
  res.json({ success: true });
});

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});

export default app;