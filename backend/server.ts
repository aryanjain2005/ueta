// import "module-alias/register";
import { config } from "dotenv";
import express, { Application } from "express";
import mongoose from "mongoose";
// import cors from "cors";
import { createServer, Server } from "http";

config({ path: "./.env" });

const PORT: number = Number(process.env.PORT) || 8000;
const MONGO_URI: string = process.env.MongoDB || "";

if (!MONGO_URI) {
  console.error("MongoDB connection string is not defined in .env");
  process.exit(1); // Exit the process with an error code
}

const app: Application = express();
const http: Server = createServer(app);

// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error: Error) => console.error("MongoDB connection error:", error));

http.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
