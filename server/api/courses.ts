import express from "express";
import { prisma } from "../db";

const router = express.Router();

// Route to get courses for a hardcoded blazerId
router.get("/", async (req, res): Promise<void> => {
    try {
        const canvasUserId = "student001"; // Hardcoded canvas id

        console.log(`Fetching courses for Canvas Id: ${canvasUserId}`);

        const enrollments = await prisma.enrollment.findMany({
            where: { canvasUserId },
            include: { course: true },
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
            include: {
                instructor: true,
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
