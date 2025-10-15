
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { authRouter } from "./routes.js";

export const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(cors({ origin: ["http://localhost:5173"], credentials: true }));

app.get("/api/v1/health", (_req, res) => res.send("OK"));
app.use("/api/v1/auth", authRouter);
