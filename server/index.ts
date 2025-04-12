import express from "express";
import { connectDB } from "./db"; // Import the database connection
import cors from "cors";

const app = express();
const port = process.env.EXPRESS_PORT;

const rootApi = "/api/v1";

connectDB(); // establish connection to MongoDB

// ========= Global middlewares =========

app.use(
    cors({
        origin: "*", // TODO: Probably shouldn't do this...
        methods: ["GET", "POST", "OPTIONS"],
        credentials: true,
    })
);

app.use(express.json());

// Health and root endpoints
app.get(`${rootApi}/health`, (req, res) => {
    res.json({ success: true });
});

app.get("/", (req, res) => {
    res.json({ success: true });
});

// TODO: Probably shouldn't do this...
app.options("*", (req, res) => {
    res.sendStatus(200);
});

// ========= Individual route configurations =========

import courses from "./api/courses";
app.use(`${rootApi}/courses`, courses);

import geofenceRoutes from "./api/geofenceRoutes";
app.use(`${rootApi}/geofence`, geofenceRoutes);

import oauthRouter from "./api/oauth";
app.use(`${rootApi}/oauth`, oauthRouter);

import qrCodes from "./api/qrCodes";
app.use(`${rootApi}/qr`, qrCodes);

app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});

export default app;
