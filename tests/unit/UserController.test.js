const { getUsers, createUser } = require('../../src/controller/UserController');

// Mock the users array for testing
const mockUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
];

describe('UserController', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      params: {},
      body: {}
    };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
    next = jest.fn();
  });

  describe('getUsers', () => {
    it('should return users list', () => {
      getUsers(req, res, next);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: expect.any(Array),
        message: 'Users retrieved successfully'
      });
    });
  });

  describe('createUser', () => {
    it('should create a new user successfully', () => {
      req.body = {
        name: 'Test User',
        email: 'test@example.com'
      };

      createUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining({
          name: 'Test User',
          email: 'test@example.com'
        }),
        message: 'User created successfully'
      });
    });

    it('should call next with validation error for missing data', () => {
      req.body = {};

      createUser(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(next.mock.calls[0][0]).toBeInstanceOf(Error);
    });
  });
});