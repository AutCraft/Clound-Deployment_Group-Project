import request from "supertest";
import { app } from "../src/auth/app.js";

describe("Register API", () => {
    const user = { email: "test1@example.com", password: "123456", name: "Test User" };

    // TC-001: Register new user
    it("TC-001: should register new user (201)", async () => {
        const res = await request(app).post("/api/v1/auth/register").send(user);
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("email", user.email.toLowerCase());
        expect(res.body).toHaveProperty("name", user.name);
        expect(res.body).toHaveProperty("id");
    });

    // TC-002: Register duplicate user
    it("TC-002: should not allow duplicate registration (409)", async () => {
        const res = await request(app).post("/api/v1/auth/register").send(user);
        expect(res.status).toBe(409);
        expect(res.body).toHaveProperty("message", "Email already used");
    });

    
});
