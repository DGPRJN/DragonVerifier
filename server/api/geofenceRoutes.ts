import express, { Request, Response } from "express";
import fs from "fs";
import path from "path";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { point } from "@turf/helpers";
import { Feature, Polygon } from "geojson";

const router = express.Router();

// Load GeoJSON geofences
const geojsonPath = path.resolve(__dirname, "../api/hhb/102.geojson");
const geojsonData = JSON.parse(fs.readFileSync(geojsonPath, "utf-8"));
console.log("✅ GeoJSON file loaded from:", geojsonPath);

router.post("/check-location", (req: Request, res: Response) => {
    console.log("✅ API hit: /check-location");

    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
        res.status(400).json({ error: "Missing latitude or longitude" });
        return;
    }

    const userPoint = point([parseFloat(longitude), parseFloat(latitude)]);
    console.log("📍 User Location:", latitude, longitude);

    const insideGeofence = geojsonData.features.some(
        (feature: Feature<Polygon>) =>
            booleanPointInPolygon(userPoint, feature.geometry)
    );

    res.json({ insideGeofence });
});

export default router;
