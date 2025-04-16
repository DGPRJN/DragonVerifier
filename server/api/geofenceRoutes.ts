import express, { Request, Response } from "express";
import fs from "fs";
import path from "path";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { point } from "@turf/helpers";
import { Feature, Polygon } from "geojson";
import { WebSocketServer } from "ws";
import { CanvasUser, JwtPayload } from "./oauth";
import cookieParser from "cookie-parser";

const router = express.Router();
router.use(cookieParser());

const canvasUrl = process.env.CANVAS_BASE_URL;

// ============
let wss: WebSocketServer | null = null;

export const setWebSocketServer = (server: WebSocketServer) => {
    wss = server;
};
// =============

// Load GeoJSON geofences
const geojsonPath = path.resolve(__dirname, "../api/ch/301.geojson");
const geojsonData = JSON.parse(fs.readFileSync(geojsonPath, "utf-8"));
console.log("✅ GeoJSON file loaded from:", geojsonPath);

router.post("/check-location", async (req: Request, res: Response) => {
    console.log("API hit ✅: /check-location");

    const cookie = req.cookies.token as string;

    let jose = await import("jose");

    const secret = jose.base64url.decode(process.env.JWT_TOKEN_SECRET!);
    if (!cookie || typeof cookie !== "string") {
        res.status(400).json({ error: "Invalid or missing token" });
        return;
    }

    let jwt;
    try {
        jwt = await jose.jwtDecrypt(cookie, secret);
    } catch (error) {
        res.status(400).json({ error: "Failed to decrypt token" });
        return;
    }

    const payload = jwt.payload.payload as JwtPayload;
    const token = payload.canvas_api_token;

    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
        res.status(400).json({ error: "Missing latitude or longitude" });
        return;
    }

    const userPoint = point([parseFloat(longitude), parseFloat(latitude)]);
    console.log("User Location: 📍", latitude, longitude);

    const insideGeofence = geojsonData.features.some(
        (feature: Feature<Polygon>) =>
            booleanPointInPolygon(userPoint, feature.geometry)
    );

    let canvasUser;

    await fetch(`${canvasUrl}/api/v1/users/${payload.user.id}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
    }).then(async (fRes) => {
        const data = await fRes.json();

        const user: CanvasUser = data;

        canvasUser = user;
    });

    // ======================
    // Broadcast to WebSocket clients
    if (wss) {
        const payload = {
            type: "checkin_attempt",
            data: {
                latitude,
                longitude,
                timestamp: new Date().toISOString(),
                success: insideGeofence,
                canvasUser: canvasUser,
            },
        };

        wss.clients.forEach((client) => {
            if (client.readyState === 1) {
                client.send(JSON.stringify(payload));
            }
        });
    }
    // ======================

    res.json({ insideGeofence });
});

export default router;
