import request from "supertest";
import { app } from "../src/app.js";

describe("Auth API (in-memory)", () => {
  const base = "/api/v1/auth";

  it("TC-001: Register new user → 201", async () => {
    const res = await request(app)
      .post(`${base}/register`)
      .send({ email: "a@b.com", password: "1234", name: "Troy" });
    expect([200,201]).toContain(res.statusCode);
    expect(res.body.email).toBe("a@b.com");
  });

  it("TC-002: Register duplicate user → 409", async () => {
    const res = await request(app)
      .post(`${base}/register`)
      .send({ email: "a@b.com", password: "1234", name: "Dup" });
    expect(res.statusCode).toBe(409);
  });

  it("TC-003: Login with correct credentials → 200 + token", async () => {
    const res = await request(app)
      .post(`${base}/login`)
      .send({ email: "a@b.com", password: "1234" });
    expect(res.statusCode).toBe(200);
    expect(res.body.accessToken).toBeDefined();
  });

  it("TC-004: Login with wrong password → 401", async () => {
    const res = await request(app)
      .post(`${base}/login`)
      .send({ email: "a@b.com", password: "wrong" });
    expect(res.statusCode).toBe(401);
  });

  it("TC-005: Access /me without token → 401", async () => {
    const res = await request(app).get(`${base}/me`);
    expect(res.statusCode).toBe(401);
  });

  it("TC-006: Access /me with valid token → 200 + user info", async () => {
    // login ก่อน เพื่อเอา access token
    const login = await request(app)
      .post(`${base}/login`)
      .send({ email: "a@b.com", password: "1234" });
    const token = login.body.accessToken as string;

    const me = await request(app)
      .get(`${base}/me`)
      .set("Authorization", `Bearer ${token}`);

    expect(me.statusCode).toBe(200);
    expect(me.body.email).toBe("a@b.com");
  });
});
