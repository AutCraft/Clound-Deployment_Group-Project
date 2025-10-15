import request from "supertest";
import { app } from "../src/auth/app.js";

describe("Login API", () => {
  const user = { email: "test1@example.com", password: "123456", name: "Test User" };

  beforeAll(async () => {
    // ลงทะเบียนผู้ใช้ก่อน เผื่อกรณีรันแยกไฟล์
    await request(app).post("/api/v1/auth/register").send(user);
  });

  // TC-003: Login with correct credentials
  it("TC-003: should login with correct credentials (200)", async () => {
    const res = await request(app).post("/api/v1/auth/login").send({
      email: user.email,
      password: user.password,
    });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("accessToken");
    expect(res.body).toHaveProperty("expiresIn");
  });

  // TC-004: Logout should clear refresh cookie and return 200
  it("TC-004: should logout and clear refresh token cookie (200)", async () => {
    // First login to ensure cookie is set
    const loginRes = await request(app).post("/api/v1/auth/login").send({
      email: user.email,
      password: user.password,
    });
    expect(loginRes.status).toBe(200);

    const res = await request(app).post("/api/v1/auth/logout");
    expect(res.status).toBe(200);
    const setCookie = res.headers['set-cookie'] || [];
    const rtCookie = setCookie.find((c: string) => c.startsWith('rt=')) as string | undefined;
    expect(rtCookie).toBeDefined();
    expect(/rt=(?:;|$)|Max-Age=0|expires=/i.test(rtCookie!)).toBeTruthy();
  });
});