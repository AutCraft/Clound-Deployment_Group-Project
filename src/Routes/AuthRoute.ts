import { Router } from "express";
import { register, login, refresh, me, logout } from "../Controller/AuthController.js";

export const authRouter = Router();
authRouter.post("/register", register);
authRouter.post("/login",    login);
authRouter.post("/refresh",  refresh);
authRouter.get("/me",        me);
authRouter.post("/logout",   logout);
