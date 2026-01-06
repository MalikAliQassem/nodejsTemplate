const { hashPassword, comparePassword } = require("../util/auth");
const {
  ValidationError,
  UnauthorizedError,
  NotFoundError,
} = require("../util/errors");

// In-memory storage for demo purposes - in production, use a database
let users = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LFvOe", // password: "password123"
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LFvOe", // password: "password123"
  },
];

let nextId = 3;

/**
 * Display login page
 */
const showLogin = (req, res) => {
  res.render("auth/login", {
    title: "Login",
    error: req.session.error,
    formData: req.session.formData || {},
  });

  // Clear session data after displaying
  delete req.session.error;
  delete req.session.formData;
};

/**
 * Display registration page
 */
const showRegister = (req, res) => {
  res.render("auth/register", {
    title: "Register",
    error: req.session.error,
    formData: req.session.formData || {},
  });

  // Clear session data after displaying
  delete req.session.error;
  delete req.session.formData;
};

/**
 * Handle user login
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      throw new ValidationError("Email and password are required");
    }

    // Find user by email
    const user = users.find((u) => u.email === email);
    if (!user) {
      throw new UnauthorizedError("Invalid email or password");
    }

    // Compare password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid email or password");
    }

    // Create session
    req.session.userId = user.id;
    req.session.userName = user.name;

    // Redirect based on request type
    if (req.xhr || req.headers.accept?.indexOf("json") > -1) {
      res.json({
        success: true,
        message: "Login successful",
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
          },
        },
      });
    } else {
      res.redirect("/dashboard");
    }
  } catch (error) {
    if (req.xhr || req.headers.accept?.indexOf("json") > -1) {
      return next(error);
    } else {
      req.session.error = error.message;
      req.session.formData = { email: req.body.email };
      res.redirect("/login");
    }
  }
};

/**
 * Handle user registration
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      throw new ValidationError("All fields are required");
    }

    if (password !== confirmPassword) {
      throw new ValidationError("Passwords do not match");
    }

    if (password.length < 6) {
      throw new ValidationError("Password must be at least 6 characters long");
    }

    // Check if user already exists
    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
      throw new ValidationError("Email already exists");
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create new user
    const newUser = {
      id: nextId++,
      name,
      email,
      password: hashedPassword,
    };

    users.push(newUser);

    // Create session
    req.session.userId = newUser.id;
    req.session.userName = newUser.name;

    // Redirect based on request type
    if (req.xhr || req.headers.accept?.indexOf("json") > -1) {
      res.status(201).json({
        success: true,
        message: "Registration successful",
        data: {
          user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
          },
        },
      });
    } else {
      res.redirect("/dashboard");
    }
  } catch (error) {
    if (req.xhr || req.headers.accept?.indexOf("json") > -1) {
      return next(error);
    } else {
      req.session.error = error.message;
      req.session.formData = { name: req.body.name, email: req.body.email };
      res.redirect("/register");
    }
  }
};

/**
 * Handle user logout
 */
const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
    }

    if (req.xhr || req.headers.accept?.indexOf("json") > -1) {
      res.json({
        success: true,
        message: "Logout successful",
      });
    } else {
      res.redirect("/login");
    }
  });
};

/**
 * Get current user information
 */
const getCurrentUser = (req, res, next) => {
  try {
    if (!req.session.userId) {
      throw new UnauthorizedError("Not authenticated");
    }

    const user = users.find((u) => u.id === req.session.userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  showLogin,
  showRegister,
  login,
  register,
  logout,
  getCurrentUser,
};
