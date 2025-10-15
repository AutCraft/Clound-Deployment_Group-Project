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

  // TC-XXX: 
  it.skip("TC-XXX: ...", async () => {
     //เพิ่มตรงนี้เน้อ
  });
});