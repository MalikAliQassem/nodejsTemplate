# AGENTS.md - Node.js Project Guidelines

This document provides essential guidelines for AI coding agents working on this Node.js project.

## Project Overview

Node.js web application with Express.js, EJS templating, Babel transpilation, and CommonJS modules. MVC architecture with REST API.

## Build, Lint & Test Commands

### Core Development Commands

```bash
# Start development server with hot reload
npm run dev

# Start production server
npm start

# Build project (transpilation)
npm run build

# Clean build output
npm run clean
```

### Testing Commands

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run a single test file
npm run test:single tests/unit/UserController.test.js

# Run tests matching a pattern
npm test -- --testNamePattern "should create user"

# Run tests in a specific directory
npm test tests/unit/

# Run tests with verbose output
npm test -- --verbose

# Run tests in a specific file with coverage
npm run test:coverage -- tests/unit/UserController.test.js
```

### Code Quality Commands

```bash
# Lint all JavaScript files
npm run lint

# Lint and auto-fix issues
npm run lint:fix

# Check code formatting
npm run format:check

# Format code automatically
npm run format

# Run full code quality check
npm run check
```

### File-Scoped Commands (AI Agent Optimized)

```bash
# Lint a specific file
npm run lint --fix src/controller/UserController.js

# Run tests for specific file
npm test tests/unit/UserController.test.js

# Format a specific file
npm run format src/controller/UserController.js

# Type check a specific file (if TypeScript is added)
npm run tsc --noEmit src/controller/UserController.js
```

## Project Structure

```
src/
├── app.js              # Main application entry point
├── config/             # Configuration files
├── controller/         # Request handlers (business logic)
├── routes/            # Route definitions
├── views/             # EJS template files
├── util/              # Utility functions
└── middleware/        # Custom middleware

dist/                    # Compiled output (built files)
tests/
├── unit/              # Unit tests
├── integration/       # Integration tests
└── fixtures/          # Test data and fixtures
```

src/

├── app.js # Main application entry point

├── config/ # Configuration files

├── controller/ # Request handlers (business logic)

├── routes/ # Route definitions

├── views/ # EJS template files

├── util/ # Utility functions

└── middleware/ # Custom middleware

dist/ # Compiled output (built files)

tests/

├── unit/ # Unit tests

├── integration/ # Integration tests

└── fixtures/ # Test data and fixtures

````

## Code Style Guidelines

### Import Conventions
- Use CommonJS `require()` syntax for consistency with existing codebase
- Group imports in this order:
  1. Node.js built-in modules (fs, path, http, etc.)
  2. Third-party npm packages
  3. Local application modules (using relative paths)
- Use descriptive imports: `const express = require('express');`
- Avoid circular dependencies in module imports

### Naming Conventions
- **Variables and functions:** camelCase (`getUserData`, `calculateTotal`, `fetchUsers`)
- **Classes and constructors:** PascalCase (`UserController`, `DatabaseService`)
- **Constants:** UPPER_SNAKE_CASE (`API_BASE_URL`, `MAX_RETRIES`, `DEFAULT_PORT`)
- **Files:** kebab-case for utilities (`date-utils.js`) and PascalCase for controllers (`UserController.js`)
- **Directories:** kebab-case for all directories

### Code Formatting Standards
- **Indentation:** 2 spaces
- **Quotes:** Single quotes for strings
- **Semicolons:** Required at end of statements
- **Line endings:** LF (Unix style)
- **Maximum line length:** 100 characters
- **Object property spacing:** One space after colon

### Error Handling Patterns
- Use try-catch blocks for async operations
- Create custom error classes that extend Error
- Use meaningful error messages with proper HTTP status codes
- Log errors with structured information (timestamp, level, message)
- Implement graceful degradation for non-critical errors
- Always re-throw errors after logging

```javascript
// Good error handling pattern
class ValidationError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ValidationError';
  }
}

async function deleteUser(userId) {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ValidationError('User not found');
    }
    await user.remove();
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    if (error instanceof ValidationError) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
```

### Function Structure Best Practices
- Keep functions small and focused on single responsibilities
- Use pure functions without side effects when possible
- Parameterize functions for reusability
- Use early returns for validation and error handling
- Document function purpose and expected inputs/outputs

## Testing Guidelines

### Test Framework Standards
- Use Jest for unit and integration testing
- Test file naming: `*.test.js` or `*.spec.js`
- Locate tests in `tests/` directory with proper subdirectory organization
- Use descriptive test names that explain the functionality being tested

### Test Structure (Arrange-Act-Assert)

```javascript
describe('UserController', () => {
  describe('createUser', () => {
    // Arrange
    const userData = {
      email: 'test@example.com',
      name: 'Test User'
    };

    // Act
    const result = createUser(userData);

    // Assert
    expect(result).toBeDefined();
    expect(result.email).toBe(userData.email);
    expect(result.name).toBe(userData.name);
  });
});
```

### Single Test Execution Examples

```bash
# Run specific test file
npm run test:single tests/unit/UserController.test.js

# Run tests matching pattern
npm test -- --testNamePattern "createUser"

# Run tests with coverage for specific file
npm run test:coverage -- tests/unit/UserController.test.js

# Run tests in watch mode for specific directory
npm test tests/unit/ --watch
```

### Coverage Requirements
- Aim for minimum 80% code coverage
- Focus on critical business logic paths
- Write tests for error handling and edge cases
- Review coverage reports and address gaps

## Development Workflow

### Pre-commit Process
1. Run linting: `npm run lint`
2. Run formatting: `npm run format`
3. Run tests: `npm test`
4. Check build: `npm run build`
5. Commit only if all checks pass

### Git Branch Strategy
- `main` - Production-ready code
- `develop` - Development work
- `feature/feature-name` - New features
- `bugfix/bug-description` - Bug fixes
- `hotfix/critical-fix` - Critical production fixes

### Commit Message Format

```
type(scope): concise description

Examples:
feat(controller): add user authentication
fix(auth): resolve login validation issue
docs(readme): update installation guide
```

type(scope): concise description



Examples:

feat(controller): add user authentication

fix(auth): resolve login validation issue

docs(readme): update installation guide

```
````
