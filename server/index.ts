import express from "express";
import { connectDB } from "./db"; // Import the database connection
import cors from "cors";
import http from "http";
import { WebSocketServer, WebSocket } from "ws";
const app = express();
const port = process.env.EXPRESS_PORT;

const frontEndUrl = process.env.NEXT_PUBLIC_FRONTEND_URL;

const rootApi = "/api/v1";

connectDB(); // establish connection to MongoDB

// ========= Global middlewares =========

app.use(
    cors({
        origin: frontEndUrl, // TODO: Probably shouldn't do this...
        methods: ["GET", "POST", "PATCH", "DELETE","OPTIONS"],
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

const server = http.createServer(app);
const wss = new WebSocketServer({ server });


// Keeps websocket alive because it will stop if no activity is present
interface CustomWebSocket extends WebSocket {
    isAlive: boolean;
}

setWebSocketServer(wss);
app.use("/api/v1/socket", geofenceRoutes);

wss.on("connection", (ws: CustomWebSocket) => {
    console.log("✅ WebSocket client connected");

    ws.isAlive = true;

    ws.on("pong", () => {
        ws.isAlive = true;
    });

    ws.on("close", () => {
        console.log("❌ WebSocket client disconnected");
    });
});


setInterval(() => {
    wss.clients.forEach((ws) => {
        const socket = ws as CustomWebSocket;

        if (!socket.isAlive) return socket.terminate();

        socket.isAlive = false;
        socket.ping();
    });
}, 30000);


server.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});

export default app;
