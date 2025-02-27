import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Load .env variables

const DATABASE_URL = process.env.DATABASE_URL as string;

if (!DATABASE_URL) {
  console.error("DATABASE_URL is missing in .env");
  process.exit(1);
}

const connectDB = async () => {
  try {
    await mongoose.connect(DATABASE_URL);
    console.log("Connected to MongoDB Cloud");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;