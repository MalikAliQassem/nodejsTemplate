const { ValidationError, NotFoundError } = require("../util/errors");
const { hashPassword } = require("../util/auth");

// In-memory storage for demo purposes - this is shared with AuthController
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

const getUsers = (req, res, next) => {
  try {
    // Remove passwords from response
    const usersWithoutPasswords = users.map((user) => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    res.json({
      success: true,
      data: usersWithoutPasswords,
      message: "Users retrieved successfully",
    });
  } catch (error) {
    next(error);
  }
};

const getUserById = (req, res, next) => {
  try {
    const { id } = req.params;
    const user = users.find((u) => u.id === parseInt(id));

    if (!user) {
      throw new NotFoundError("User not found");
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = user;

    res.json({
      success: true,
      data: userWithoutPassword,
      message: "User retrieved successfully",
    });
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email) {
      throw new ValidationError("Name and email are required");
    }

    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
      throw new ValidationError("Email already exists");
    }

    const newUser = {
      id: nextId++,
      name,
      email,
    };

    // Only add password if provided (for admin creation)
    if (password) {
      newUser.password = await hashPassword(password);
    }

    users.push(newUser);

    // Remove password from response
    const { password: _, ...userResponse } = newUser;

    res.status(201).json({
      success: true,
      data: userResponse,
      message: "User created successfully",
    });
  } catch (error) {
    next(error);
  }
};

const updateUser = (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    const userIndex = users.findIndex((u) => u.id === parseInt(id));

    if (userIndex === -1) {
      throw new NotFoundError("User not found");
    }

    if (!name && !email) {
      throw new ValidationError(
        "At least one field (name or email) is required",
      );
    }

    if (email) {
      const existingUser = users.find(
        (u) => u.email === email && u.id !== parseInt(id),
      );
      if (existingUser) {
        throw new ValidationError("Email already exists");
      }
      users[userIndex].email = email;
    }

    if (name) {
      users[userIndex].name = name;
    }

    res.json({
      success: true,
      data: users[userIndex],
      message: "User updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

const deleteUser = (req, res, next) => {
  try {
    const { id } = req.params;
    const userIndex = users.findIndex((u) => u.id === parseInt(id));

    if (userIndex === -1) {
      throw new NotFoundError("User not found");
    }

    const deletedUser = users.splice(userIndex, 1)[0];

    res.json({
      success: true,
      data: deletedUser,
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
