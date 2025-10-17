import type { Request, Response } from "express";
import crypto from "crypto";
import { signAccess, signRefresh, verifyJwt } from "./jwt.js";
import { users, findByEmail } from "../Database/users.js";

const validRefreshTokens = new Set<string>();
const revokedAccessTokens = new Set<string>();

export const register = (req: Request, res: Response) => {
  const { email, password, name } = req.body || {};
  if (!email || !password || !name) return res.status(400).json({ message: "invalid payload" });
  if (findByEmail(String(email).toLowerCase())) return res.status(409).json({ message: "Email already used" });

  const id = crypto.randomUUID();
  const user = { id, email: String(email).toLowerCase(), password: String(password), name: String(name).trim() };
  users.set(id, user);
  return res.status(201).json({ id: user.id, email: user.email, name: user.name });
};

export const login = (req: Request, res: Response) => {
  const { email, password } = req.body || {};
  const user = findByEmail(String(email || "").toLowerCase());
  if (!user || user.password !== password) return res.status(401).json({ message: "Invalid credentials" });

  const access = signAccess(user.id);
  const refresh = signRefresh(user.id);
  validRefreshTokens.add(refresh);
  res.cookie("rt", refresh, { httpOnly: true, secure: true, sameSite: "strict", path: "/" });
  return res.json({ accessToken: access, expiresIn: parseInt(process.env.ACCESS_EXPIRES_SEC || "3600", 10) });
};

export const refresh = (req: Request, res: Response) => {
  const rt = req.cookies?.rt;
  if (!rt) return res.sendStatus(401);
  if (!validRefreshTokens.has(rt)) return res.sendStatus(401);

  try {
    const payload = verifyJwt(rt);
    const sub = String(payload.sub || "");
    if (!sub.startsWith("rt:")) return res.sendStatus(401);
    const userId = sub.replace(/^rt:/, "");
    if (!users.get(userId)) return res.sendStatus(401);
    const access = signAccess(userId);
    return res.json({ accessToken: access, expiresIn: parseInt(process.env.ACCESS_EXPIRES_SEC || "3600", 10) });
  } catch {
    return res.sendStatus(401);
  }
};

export const me = (req: Request, res: Response) => {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!token) return res.sendStatus(401);
  try {
    if (revokedAccessTokens.has(token)) return res.sendStatus(401);
    const payload = verifyJwt(token);
    const user = users.get(String(payload.sub));
    if (!user) return res.sendStatus(404);
    return res.json({ id: user.id, email: user.email, name: user.name });
  } catch {
    return res.sendStatus(401);
  }
};

export const logout = (req: Request, res: Response) => {
  const rt = req.cookies?.rt;
  if (rt) validRefreshTokens.delete(rt);
  const auth = req.headers.authorization || "";
  const at = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (at) revokedAccessTokens.add(at);
  res.clearCookie("rt", { path: "/" });
  return res.status(200).json({ message: "Logout success" });
};
