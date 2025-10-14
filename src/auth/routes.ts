import { Router, Request, Response } from "express";
import { signAccess, signRefresh, verifyJwt } from "./jwt";

type User = { id: string; email: string; password: string; name: string };
const users = new Map<string, User>();
const findByEmail = (email: string) => [...users.values()].find(u => u.email === email);

export const authRouter = Router();

authRouter.post("/register", (req: Request, res: Response) => {
  const { email, password, name } = req.body || {};
  if (!email || !password || !name) return res.status(400).json({ message: "invalid payload" });
  if (findByEmail(String(email).toLowerCase())) return res.status(409).json({ message: "Email already used" });

  const id = crypto.randomUUID();
  const user: User = { id, email: String(email).toLowerCase(), password: String(password), name: String(name).trim() };
  users.set(id, user);
  return res.status(201).json({ id: user.id, email: user.email, name: user.name });
});

authRouter.post("/login", (req: Request, res: Response) => {
  const { email, password } = req.body || {};
  const user = findByEmail(String(email || "").toLowerCase());
  if (!user || user.password !== password) return res.status(401).json({ message: "Invalid credentials" });

  const access = signAccess(user.id);
  const refresh = signRefresh(user.id);
  res.cookie("rt", refresh, { httpOnly: true, secure: true, sameSite: "strict", path: "/" });
  return res.json({ accessToken: access, expiresIn: parseInt(process.env.ACCESS_EXPIRES_SEC || "3600", 10) });
});

authRouter.post("/refresh", (req: Request, res: Response) => {
  const rt = req.cookies?.rt;
  if (!rt) return res.sendStatus(401);
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
});

authRouter.get("/me", (req: Request, res: Response) => {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!token) return res.sendStatus(401);
  try {
    const payload = verifyJwt(token);
    const user = users.get(String(payload.sub));
    if (!user) return res.sendStatus(404);
    return res.json({ id: user.id, email: user.email, name: user.name });
  } catch {
    return res.sendStatus(401);
  }
});

authRouter.post("/logout", (_req: Request, res: Response) => {
  res.clearCookie("rt", { path: "/" });
  return res.sendStatus(200);
});
