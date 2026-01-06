const { ValidationError, NotFoundError } = require('../util/errors');

// In-memory storage for demo purposes
let users = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
];

let nextId = 3;

const getUsers = (req, res) => {
  try {
    res.json({
      success: true,
      data: users,
      message: 'Users retrieved successfully'
    });
  } catch (error) {
    next(error);
  }
};

const getUserById = (req, res, next) => {
  try {
    const { id } = req.params;
    const user = users.find(u => u.id === parseInt(id));
    
    if (!user) {
      throw new NotFoundError('User not found');
    }
    
    res.json({
      success: true,
      data: user,
      message: 'User retrieved successfully'
    });
  } catch (error) {
    next(error);
  }
};

const createUser = (req, res, next) => {
  try {
    const { name, email } = req.body;
    
    if (!name || !email) {
      throw new ValidationError('Name and email are required');
    }
    
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      throw new ValidationError('Email already exists');
    }
    
    const newUser = {
      id: nextId++,
      name,
      email
    };
    
    users.push(newUser);
    
    res.status(201).json({
      success: true,
      data: newUser,
      message: 'User created successfully'
    });
  } catch (error) {
    next(error);
  }
};

const updateUser = (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;
    
    const userIndex = users.findIndex(u => u.id === parseInt(id));
    
    if (userIndex === -1) {
      throw new NotFoundError('User not found');
    }
    
    if (!name && !email) {
      throw new ValidationError('At least one field (name or email) is required');
    }
    
    if (email) {
      const existingUser = users.find(u => u.email === email && u.id !== parseInt(id));
      if (existingUser) {
        throw new ValidationError('Email already exists');
      }
      users[userIndex].email = email;
    }
    
    if (name) {
      users[userIndex].name = name;
    }
    
    res.json({
      success: true,
      data: users[userIndex],
      message: 'User updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

const deleteUser = (req, res, next) => {
  try {
    const { id } = req.params;
    const userIndex = users.findIndex(u => u.id === parseInt(id));
    
    if (userIndex === -1) {
      throw new NotFoundError('User not found');
    }
    
    const deletedUser = users.splice(userIndex, 1)[0];
    
    res.json({
      success: true,
      data: deletedUser,
      message: 'User deleted successfully'
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
  deleteUser
};