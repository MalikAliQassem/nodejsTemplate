const request = require("supertest");
const app = require("../../src/app");

describe("Auth Routes", () => {
  describe("GET /login", () => {
    it("should return login page", async () => {
      const response = await request(app).get("/login").expect(200);

      expect(response.text).toContain("Login");
      expect(response.text).toContain("Sign in to your account");
    });
  });

  describe("GET /register", () => {
    it("should return register page", async () => {
      const response = await request(app).get("/register").expect(200);

      expect(response.text).toContain("Register");
      expect(response.text).toContain("Create your account");
    });
  });

  describe("POST /register", () => {
    it("should register a new user successfully", async () => {
      const newUser = {
        name: "Test User",
        email: "testuser@example.com",
        password: "password123",
        confirmPassword: "password123",
      };

      const response = await request(app)
        .post("/register")
        .send(newUser)
        .expect(302); // Redirect after successful registration

      expect(response.headers.location).toBe("/dashboard");
    });

    it("should not register user with mismatched passwords", async () => {
      const invalidUser = {
        name: "Test User",
        email: "testuser@example.com",
        password: "password123",
        confirmPassword: "differentpassword",
      };

      const response = await request(app)
        .post("/register")
        .send(invalidUser)
        .expect(302); // Redirect back to register page

      expect(response.headers.location).toBe("/register");
    });

    it("should not register user with existing email", async () => {
      const existingUser = {
        name: "Test User",
        email: "john@example.com", // This email already exists
        password: "password123",
        confirmPassword: "password123",
      };

      const response = await request(app)
        .post("/register")
        .send(existingUser)
        .expect(302); // Redirect back to register page

      expect(response.headers.location).toBe("/register");
    });
  });

  describe("POST /login", () => {
    it("should login with valid credentials", async () => {
      const loginData = {
        email: "john@example.com",
        password: "password123",
      };

      const response = await request(app)
        .post("/login")
        .send(loginData)
        .expect(302); // Redirect after successful login

      expect(response.headers.location).toBe("/dashboard");
    });

    it("should not login with invalid credentials", async () => {
      const invalidLoginData = {
        email: "john@example.com",
        password: "wrongpassword",
      };

      const response = await request(app)
        .post("/login")
        .send(invalidLoginData)
        .expect(302); // Redirect back to login page

      expect(response.headers.location).toBe("/login");
    });

    it("should not login with non-existent user", async () => {
      const nonExistentUser = {
        email: "nonexistent@example.com",
        password: "password123",
      };

      const response = await request(app)
        .post("/login")
        .send(nonExistentUser)
        .expect(302); // Redirect back to login page

      expect(response.headers.location).toBe("/login");
    });
  });

  describe("POST /logout", () => {
    it("should logout successfully", async () => {
      // First login to create a session
      const agent = request.agent(app);

      await agent.post("/login").send({
        email: "john@example.com",
        password: "password123",
      });

      // Then logout
      const response = await agent.post("/logout").expect(302);

      expect(response.headers.location).toBe("/login");
    });
  });

  describe("Protected Routes", () => {
    it("should redirect to login when accessing dashboard without authentication", async () => {
      const response = await request(app).get("/dashboard").expect(302);

      expect(response.headers.location).toBe("/login");
    });

    it("should redirect to login when accessing API without authentication", async () => {
      const response = await request(app).get("/api/users").expect(302);

      expect(response.headers.location).toBe("/login");
    });
  });
});
