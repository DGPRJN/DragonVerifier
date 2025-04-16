import express from "express";
import { connectDB } from "./db"; // Import the database connection
import cors from "cors";
import http from "http";
import { WebSocketServer } from "ws";
const app = express();
const port = process.env.EXPRESS_PORT;

const frontEndUrl = process.env.NEXT_PUBLIC_FRONTEND_URL;

// =============================
const server = http.createServer(app);
const wss = new WebSocketServer({ server });
// ==============================

const rootApi = "/api/v1";

connectDB(); // establish connection to MongoDB

// ========= Global middlewares =========

app.use(
    cors({
        origin: frontEndUrl, // TODO: Probably shouldn't do this...
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

import geofenceRoutes, { setWebSocketServer } from "./api/geofenceRoutes";
app.use(`${rootApi}/geofence`, geofenceRoutes);

import oauthRouter from "./api/oauth";
app.use(`${rootApi}/oauth`, oauthRouter);

import qrCodes from "./api/qrCodes";
app.use(`${rootApi}/qr`, qrCodes);

// ========================

setWebSocketServer(wss);
app.use("/api/v1/geofence", geofenceRoutes);

wss.on("connection", (ws) => {
    console.log("✅ WebSocket client connected");

    ws.on("close", () => {
        console.log("❌ WebSocket client disconnected");
    });
});

// =========================

server.listen(port, () => {
    // Change back after demo maybe to app.listen
    console.log(`Server started at http://localhost:${port}`);
});

export default app;
