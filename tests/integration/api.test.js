const request = require("supertest");
const app = require("../../src/app");

describe("API Routes", () => {
  describe("GET /api/health", () => {
    it("should return health check response", async () => {
      const response = await request(app).get("/api/health").expect(200);

      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty("message", "API is running");
      expect(response.body).toHaveProperty("timestamp");
    });
  });

  describe("Protected API Routes", () => {
    let authenticatedAgent;

    beforeAll(async () => {
      // Create authenticated agent
      authenticatedAgent = request.agent(app);

      // Login to get session
      await authenticatedAgent.post("/login").send({
        email: "john@example.com",
        password: "password123",
      });
    });

    describe("GET /api/users", () => {
      it("should return list of users when authenticated", async () => {
        const response = await authenticatedAgent.get("/api/users").expect(200);

        expect(response.body).toHaveProperty("success", true);
        expect(response.body).toHaveProperty("data");
        expect(Array.isArray(response.body.data)).toBe(true);
      });

      it("should redirect to login when not authenticated", async () => {
        const response = await request(app).get("/api/users").expect(302);

        expect(response.headers.location).toBe("/login");
      });
    });

    describe("POST /api/users", () => {
      it("should create a new user when authenticated", async () => {
        const userData = {
          name: "Test User",
          email: "testnewuser@example.com",
        };

        const response = await authenticatedAgent
          .post("/api/users")
          .send(userData)
          .expect(201);

        expect(response.body).toHaveProperty("success", true);
        expect(response.body.data).toHaveProperty("name", userData.name);
        expect(response.body.data).toHaveProperty("email", userData.email);
      });

      it("should redirect to login when not authenticated", async () => {
        const userData = {
          name: "Test User",
          email: "test@example.com",
        };

        const response = await request(app)
          .post("/api/users")
          .send(userData)
          .expect(302);

        expect(response.headers.location).toBe("/login");
      });

      it("should return validation error for missing data", async () => {
        const response = await authenticatedAgent
          .post("/api/users")
          .send({})
          .expect(400);

        expect(response.body).toHaveProperty("success", false);
        expect(response.body.error).toHaveProperty("code", "VALIDATION_ERROR");
      });
    });

    describe("GET /api/users/:id", () => {
      it("should return a specific user when authenticated", async () => {
        const response = await authenticatedAgent
          .get("/api/users/1")
          .expect(200);

        expect(response.body).toHaveProperty("success", true);
        expect(response.body.data).toHaveProperty("id");
      });

      it("should redirect to login when not authenticated", async () => {
        const response = await request(app).get("/api/users/1").expect(302);

        expect(response.headers.location).toBe("/login");
      });

      it("should return 404 for non-existent user", async () => {
        const response = await authenticatedAgent
          .get("/api/users/999")
          .expect(404);

        expect(response.body).toHaveProperty("success", false);
        expect(response.body.error).toHaveProperty("code", "NOT_FOUND");
      });
    });
  });
});
