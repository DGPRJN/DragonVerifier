import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import { prisma } from "../db";
import { JwtPayload } from "./oauth";

const router = express.Router();
router.use(cookieParser());

type QRCodeEntry = {
  createdAt: number;
  expireTime: number;
};

const qrCodes = new Map<string, QRCodeEntry>();


// Cleanup job to remove expired codes every 5 seconds
setInterval(() => {
  const now = Date.now(); 
  for (const [key, value] of qrCodes.entries()) {
    if (now - value.createdAt > value.expireTime * 60 * 1000) { 
      qrCodes.delete(key);
    }
  }
}, 5000);

router.get("/:id", async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  const { id } = req.params;
  const entry = qrCodes.get(id);
  
  if (!entry) {
    res.status(404).json({ valid: false, reason: "Not found or expired" });
    return;
  }

  const expiredTimeConverted = entry.expireTime * 60 * 1000;
  const expired = Date.now() - entry.createdAt > expiredTimeConverted;

  if (expired) {
    console.log(`${id} expired`);
    qrCodes.delete(id);
    res.status(410).json({ valid: false, reason: "Expired" });
    return;
  }

  res.json({ valid: true, expireTime: entry.expireTime });
});

router.post("/", async (req: Request<{ id: string }>, res: Response): Promise<void> => {
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
    
    const { id, courseId } = req.body;

    if (!id || !courseId) {
      res.status(400).json({ success: false, message: "Missing QR ID or Course ID" });
      return;
    }

    const course = await prisma.course.findFirst({
        where: { canvasUserId: payload.user.id.toString(), id: courseId },
        select: { timer: true } },
    );

    if (!course) {
      res.status(404).json({ success: false, message: "Course not found" });
      return;
    }
    
    const expire_time = course.timer;

    qrCodes.set(id, { createdAt: Date.now(), expireTime: expire_time });

    const expiredTimeConverted = expire_time * 60 * 1000;
    const existingEntry = qrCodes.get(id);
    if (existingEntry && Date.now() - existingEntry.createdAt > expiredTimeConverted) {
      qrCodes.delete(id);
    }
  
    qrCodes.set(id, { createdAt: Date.now(), expireTime: expire_time });
    res.status(201).json({ success: true });
});

  

export default router;
