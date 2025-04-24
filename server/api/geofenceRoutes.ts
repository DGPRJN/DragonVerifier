import express, { Request, Response } from "express";
import fs from "fs";
import path from "path";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { point } from "@turf/helpers";
import { Feature, Polygon } from "geojson";
import { WebSocketServer } from "ws";
import { CanvasUser, JwtPayload } from "./oauth";
import cookieParser from "cookie-parser";
import { prisma } from "../db";

const router = express.Router();
router.use(cookieParser());

const canvasUrl = process.env.CANVAS_BASE_URL;

//WebSocket integration
let wss: WebSocketServer | null = null;

export const setWebSocketServer = (server: WebSocketServer) => {
    wss = server;
};


//Recent check-ins logic in memory (Local Storage)
const recentCheckins: any[] = [];

const addRecentCheckin = (checkinData: any) => {
    recentCheckins.unshift(checkinData);
    if (recentCheckins.length > 50) {
        recentCheckins.pop();
    }
};


router.get("/recent-checkins", (req: Request, res: Response) => {
    res.json(recentCheckins);
});


// Logic for deleting check-ins older than 30 minutes
setInterval(() => {
    const THIRTY_MINUTES = 2 * 60 * 1000; //2 minutes atm, change later
    const now = Date.now();

    const beforeLength = recentCheckins.length;

    // Filters out any check-ins older than 30 minutes
    const filtered = recentCheckins.filter((checkin) => {
        const time = new Date(checkin.timestamp).getTime();
        return now - time <= THIRTY_MINUTES;
    });

    if (filtered.length !== beforeLength) {
        console.log(`Cleaned up ${beforeLength - filtered.length} old check-ins`);
    }

    recentCheckins.length = 0;
    recentCheckins.push(...filtered);

}, 1 * 60 * 1000); // Runs every 5 minutes (1 minute atm, change later)


let geojsonCache: Record<string, Feature<Polygon>[]> = {};

// Function to load Geojson data
const loadGeoJSON = (buildingCode: string, roomNumber: string): Feature<Polygon>[] | null => {
    const cacheKey = `${buildingCode}-${roomNumber}`;
    if (geojsonCache[cacheKey]) return geojsonCache[cacheKey];

    const filename = `${roomNumber}.geojson`;
    const geojsonPath = path.resolve(__dirname, `../api/${buildingCode}/${filename}`);

    if (!fs.existsSync(geojsonPath)) {
        console.warn(`GeoJSON not found: ${geojsonPath}`);
        return null;
    }

    try {
        const data = JSON.parse(fs.readFileSync(geojsonPath, "utf-8"));
        geojsonCache[cacheKey] = data.features;
        return data.features;
    } catch (err) {
        console.error("Failed to parse GeoJSON:", err);
        return null;
    }
};



router.post("/check-location", async (req: Request, res: Response) => {
    console.log("API hit ✅: /check-location");

    // Canvas logic
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

    const course = await prisma.enrollment.findFirst({
        where: { canvasUserId: payload.user.id.toString() },
        select: { id: true, canvasId: true, course: { select: { geolocationEnabled: true } } }
    });

    if (!course?.course?.geolocationEnabled) {
        res.json({ insideGeofence: true });
        return;
    }
    
    const classroom = await prisma.classroomLocation.findFirst({
        where: { canvasId: course?.canvasId },
        select: {
            buildingCode: true,
            roomNumber: true,
            course: { select: { geolocationEnabled: true } },
          },
    });

    
      
    if (!course || !classroom) {
        res.status(404).json({ error: "Error getting course or classroom" });
        return;
    } 

    const buildingCode = classroom.buildingCode.toLocaleLowerCase();
    const roomNumber = classroom.roomNumber;

    const geojsonFeatures = loadGeoJSON(buildingCode, roomNumber);
    if (!geojsonFeatures) {
        res.status(500).json({ error: "GeoJSON not found." }); 
        return;
    }

    
    const userPoint = point([parseFloat(longitude), parseFloat(latitude)]);
    console.log("User Location: 📍", latitude, longitude);

    const insideGeofence = geojsonFeatures.some(
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

    const checkinPayload = {
        latitude,
        longitude,
        timestamp: new Date().toISOString(),
        success: insideGeofence,
        canvasUser: canvasUser,
    };

    // Adds the checkin to the array
    addRecentCheckin(checkinPayload);

    // Broadcast to WebSocket clients
    if (wss) {
        const payload = {
            type: "checkin_attempt",
            data: checkinPayload,
        };

        wss.clients.forEach((client) => {
            if (client.readyState === 1) {
                client.send(JSON.stringify(payload));
            }
        });
    }

    res.json({ insideGeofence });
});

export default router;
