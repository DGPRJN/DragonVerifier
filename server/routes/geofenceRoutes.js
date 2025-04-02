import express from "express";
import { fileURLToPath } from 'url';
import fs from "fs";
import path from "path";
import * as turf from "@turf/turf";

const router = express.Router();

// Load GeoJSON geofences
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const geojsonPath = path.join(__dirname, "../tester.geojson");
const geojsonData = JSON.parse(fs.readFileSync(geojsonPath, "utf-8"));
console.log("GeoJSON file path:", geojsonPath);


router.post("/check-location", (req, res) => {
  console.log("✅ API hit: /check-location");

  const { latitude, longitude } = req.body;

  if (!latitude || !longitude) {
    return res.status(400).json({ error: "Missing latitude or longitude" });
  }

  const userPoint = turf.point([longitude, latitude]);
  console.log(latitude);
  console.log(longitude)

  const insideGeofence = geojsonData.features.some((feature) =>
    turf.booleanPointInPolygon(userPoint, feature)
  );

  res.json({insideGeofence});
});

export default router;
