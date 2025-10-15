import request from "supertest";
import { app } from "../src/auth/app.js";

describe("Profile API", () => {
  const user = { email: "test-profile@example.com", password: "abcdef", name: "Profile User" };
  let accessToken: string | undefined;

  beforeAll(async () => {
    // register user
    await request(app).post("/api/v1/auth/register").send(user);
    const login = await request(app).post("/api/v1/auth/login").send({ email: user.email, password: user.password });
    accessToken = login.body?.accessToken;
  });

  // TC-005: GET /me without token should return 401
  it("TC-005: should return 401 when fetching profile without token", async () => {
    const res = await request(app).get("/api/v1/auth/me");
    expect(res.status).toBe(401);
  });

  // TC-006: GET /me with valid access token should return 200 and profile
  it("TC-006: should return profile with valid access token (200)", async () => {
    expect(accessToken).toBeDefined();
    const res = await request(app).get("/api/v1/auth/me").set("Authorization", `Bearer ${accessToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("email", user.email.toLowerCase());
    expect(res.body).toHaveProperty("name", user.name);
  });
});
