import { PrismaClient } from "@prisma/client";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
    console.error("DATABASE_URL is missing in .env");
    process.exit(1);
}

// Initialize Prisma Client
const prisma = new PrismaClient();

const connectDB = async () => {
    try {
        await prisma.$connect();
        console.log("Connected to MongoDB Cloud via Prisma");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};

export { prisma, connectDB };
