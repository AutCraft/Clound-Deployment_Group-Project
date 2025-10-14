import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
const ISS = "ts-auth";
const AUD = "ts-client";
const ACCESS_EXPIRES_SEC = parseInt(process.env.ACCESS_EXPIRES_SEC || "3600", 10);
const REFRESH_EXPIRES_SEC = parseInt(process.env.REFRESH_EXPIRES_SEC || String(60*60*24*14), 10);

export const signAccess = (sub: string) =>
  jwt.sign({}, JWT_SECRET, { subject: sub, issuer: ISS, audience: AUD, expiresIn: ACCESS_EXPIRES_SEC });

export const signRefresh = (sub: string) =>
  jwt.sign({ t: "rt" }, JWT_SECRET, { subject: `rt:${sub}`, issuer: ISS, audience: AUD, expiresIn: REFRESH_EXPIRES_SEC });

export const verifyJwt = (token: string) =>
  jwt.verify(token, JWT_SECRET, { issuer: ISS, audience: AUD }) as jwt.JwtPayload;
