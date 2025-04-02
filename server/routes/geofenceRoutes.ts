import express, { Request, Response } from "express";
import fs from "fs";
import path from "path";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { Polygon } from "geojson";

const router = express.Router();

// Load GeoJSON geofences
const geojsonPath = path.resolve(__dirname, "../tester.geojson");
const geojsonData = JSON.parse(fs.readFileSync(geojsonPath, "utf-8"));
console.log("GeoJSON file path:", geojsonPath);

router.post("/check-location", (req: Request, res: Response) => {
    console.log("✅ API hit: /check-location");

    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
        res.status(400).json({ error: "Missing latitude or longitude" });
        return;
    }

    const userPoint = turf.point([longitude, latitude]);
    console.log(latitude);
    console.log(longitude);

    const insideGeofence = geojsonData.features.some((feature: Polygon) =>
        booleanPointInPolygon(userPoint, feature)
    );

    res.json({ insideGeofence });
});

export default router;
