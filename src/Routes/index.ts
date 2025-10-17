import { Router } from "express";
import { authRouter } from "./AuthRoute.js";

export const api = Router();
api.get("/health", (_req, res) => res.send("OK"));
api.use("/auth", authRouter);
