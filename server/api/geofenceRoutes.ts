import express, { Request, Response } from "express";
import fs from "fs";
import path from "path";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { point } from "@turf/helpers";
import { Feature, Polygon } from "geojson";
import { WebSocketServer } from "ws";

const router = express.Router();

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

router.post("/check-location", (req: Request, res: Response) => {
    console.log("API hit ✅: /check-location");

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
