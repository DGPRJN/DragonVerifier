import express from "express";
import { prisma, connectDB } from "./db.js"; // Import the database connection
import cors from "cors";
import bodyParser from "body-parser";
// @ts-ignore
import geofenceRoutes from "./routes/geofenceRoutes.js";

const app = express();
const port = process.env.EXPRESS_PORT;

const rootApi = "/api/v1";

connectDB(); // establish connection to MongoDB

// Endpoint to ensure the API is up and running
app.get(`${rootApi}/health`, (req, res) => {
    res.json({ success: true });
});

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); // Allow all origins (change "*" to specific domains if needed)
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

app.options("*", (req, res) => {
    res.sendStatus(200);
});

app.use(express.json());

// Import and use the OAuth router
import oauthRouter from "./api/oauth";
app.use(`${rootApi}/oauth`, oauthRouter);

app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});

app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true,
    })
);

app.use(bodyParser.json());
app.use("/api", geofenceRoutes);

export default app;
