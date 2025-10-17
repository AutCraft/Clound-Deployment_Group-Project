import request from "supertest";
import { app } from "../index.js";

describe("Logout API", () => {
	const user = { email: "test-logout@example.com", password: "p@ssw0rd", name: "Logout User" };
	let accessToken: string | undefined;
	let cookies: string[] | undefined;

	beforeAll(async () => {
		await request(app).post("/api/v1/auth/register").send(user);
		const loginRes = await request(app).post("/api/v1/auth/login").send({ email: user.email, password: user.password });
		expect(loginRes.status).toBe(200);
		accessToken = loginRes.body?.accessToken;
		cookies = loginRes.headers["set-cookie"] as unknown as string[] | undefined;
	});

	// TC-007: Logout with valid token -> 200 OK + "Logout success"
	it("TC-007: should logout with valid token (200) and message", async () => {
		expect(accessToken).toBeDefined();
		const agent = request(app);
		const req = agent.post("/api/v1/auth/logout");
		if (cookies && cookies.length) req.set("Cookie", cookies);
		if (accessToken) req.set("Authorization", `Bearer ${accessToken}`);
		const res = await req;
		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty("message", "Logout success");
	});

	// TC-008: Access /me after logout -> 401 Unauthorized (Token invalid)
	it("TC-008: should get 401 when accessing /me after logout", async () => {
		expect(accessToken).toBeDefined();
		const res = await request(app).get("/api/v1/auth/me").set("Authorization", `Bearer ${accessToken}`);
		expect(res.status).toBe(401);
	});
});
