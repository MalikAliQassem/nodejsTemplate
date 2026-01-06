const { hashPassword, comparePassword } = require("../../src/util/auth");

describe("Auth Utilities", () => {
  describe("hashPassword", () => {
    it("should hash a password successfully", async () => {
      const password = "testpassword123";
      const hashedPassword = await hashPassword(password);

      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).not.toBe(password);
      expect(hashedPassword.length).toBeGreaterThan(50); // bcrypt hashes are typically 60 chars
    });

    it("should throw error for short password", async () => {
      const shortPassword = "123";

      await expect(hashPassword(shortPassword)).rejects.toThrow(
        "Password must be at least 6 characters long",
      );
    });

    it("should throw error for empty password", async () => {
      await expect(hashPassword("")).rejects.toThrow(
        "Password must be at least 6 characters long",
      );
    });
  });

  describe("comparePassword", () => {
    it("should compare correct password successfully", async () => {
      const password = "testpassword123";
      const hashedPassword = await hashPassword(password);

      const isMatch = await comparePassword(password, hashedPassword);

      expect(isMatch).toBe(true);
    });

    it("should reject incorrect password", async () => {
      const password = "testpassword123";
      const wrongPassword = "wrongpassword";
      const hashedPassword = await hashPassword(password);

      const isMatch = await comparePassword(wrongPassword, hashedPassword);

      expect(isMatch).toBe(false);
    });

    it("should return false for empty password", async () => {
      const hashedPassword = await hashPassword("testpassword123");

      const isMatch = await comparePassword("", hashedPassword);

      expect(isMatch).toBe(false);
    });

    it("should return false for empty hashed password", async () => {
      const isMatch = await comparePassword("testpassword123", "");

      expect(isMatch).toBe(false);
    });

    it("should return false for null inputs", async () => {
      const isMatch1 = await comparePassword(null, "hash");
      const isMatch2 = await comparePassword("password", null);
      const isMatch3 = await comparePassword(null, null);

      expect(isMatch1).toBe(false);
      expect(isMatch2).toBe(false);
      expect(isMatch3).toBe(false);
    });
  });
});
