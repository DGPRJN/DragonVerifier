import express, { Request, Response } from "express";

// QR Code expire time (set to 1 minute at the moment)
// Set this time to whatever you need for ease of use when testing
const expire_time = 60000;

const router = express.Router();

type QRCodeEntry = {
    createdAt: number;
};

const qrCodes = new Map<string, QRCodeEntry>();

// Cleanup job to remove expired codes every 5 seconds
setInterval(() => {
    const now = Date.now();
    for (const [key, value] of qrCodes.entries()) {
        if (now - value.createdAt > expire_time) {
            qrCodes.delete(key);
        }
    }
}, 5000);

router.get("/:id", (req: Request<{ id: string }>, res: Response): void => {
    const { id } = req.params;
    const entry = qrCodes.get(id);

    console.log(`(DONT FORGET TO REMOVE THIS) QR Code Id to paste: ${id}`);

    if (!entry) {
        res.status(404).json({ valid: false, reason: "Not found or expired" });
        return;
    }

    const expired = Date.now() - entry.createdAt > expire_time;

    if (expired) {
        console.log(`QR code ${id} expired`);
        qrCodes.delete(id);
        res.status(410).json({ valid: false, reason: "Expired" });
        return;
    }

    res.json({ valid: true });
});

router.post("/", (req: Request<{ id: string }>, res: Response): void => {
    const { id } = req.body;

    if (!id) {
        res.status(400).json({ success: false, message: "Missing QR ID" });
    }

    // Check if the QR code exists and is expired before registering it
    const existingEntry = qrCodes.get(id);
    if (existingEntry && Date.now() - existingEntry.createdAt > expire_time) {
        qrCodes.delete(id);
    }

    // Register the new QR code
    qrCodes.set(id, { createdAt: Date.now() });

    res.json({ success: true });
});

export default router;
