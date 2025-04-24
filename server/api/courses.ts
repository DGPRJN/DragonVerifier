import express from "express";
import { prisma } from "../db";
import { JwtPayload } from "./oauth";
import cookieParser from "cookie-parser";

const router = express.Router();
router.use(cookieParser()); 

// Route to get courses for a canvas id
router.get("/", async (req, res): Promise<void> => {
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
    try {
        const canvasUserId = payload.user.id.toString(); 
        console.log(canvasUserId);

        console.log(`Fetching courses for Canvas Id: ${canvasUserId}`);

        const enrollments = await prisma.enrollment.findMany({
            where: { canvasUserId },
            include: {
              course: {
                include: {
                  instructor: true,
                },
              },
            },
          });

        if (!enrollments.length) {
            res.status(404).json({ error: "No courses found for this user" });
            return;
        }

        res.json(enrollments.map((enrollment) => enrollment.course));
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Route to get all courses
router.get("/all", async (req, res): Promise<void> => {
    try {
        console.log("Fetching all courses");

        const courses = await prisma.course.findMany(); // Fetch all courses
        res.json(courses);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Route to get a single course by ID
router.get("/:courseId", async (req, res): Promise<void> => {
    try {
        const { courseId } = req.params;

        console.log(`Fetching course with ID: ${courseId}`);

        const course = await prisma.course.findUnique({
            where: { id: courseId },
            select: { 
                id: true,
                canvasId: true,
                name: true,
                instructor: true,
                attendance: true, 
                datesArray: true, 
                schedule:true,
            },
        });

        if (!course) {
            res.status(404).json({ error: "Course not found" });
            return;
        }

        res.json(course);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;
