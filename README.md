# TestApp

A Node.js web application built with Express.js, EJS templating, and following MVC architecture patterns.

## Features

- Express.js framework with REST API
- EJS templating engine
- Babel transpilation for modern JavaScript
- Comprehensive error handling
- In-memory data storage for demo
- Unit and integration tests with Jest
- Code formatting with Prettier
- Linting with ESLint

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd TestApp

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Run development server
npm run dev
```

## Available Scripts

```bash
# Development
npm run dev          # Start development server with hot reload
npm start            # Start production server
npm run build        # Transpile ES6+ to ES5

# Testing
npm test             # Run all tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage

# Code Quality
npm run lint         # Check for linting errors
npm run lint:fix     # Fix linting errors
npm run format       # Format code with Prettier
npm run check        # Run all quality checks
```

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## Project Structure

```
TestApp/
├── src/
│   ├── controller/         # Request handlers
│   ├── routes/            # Route definitions
│   ├── middleware/        # Custom middleware
│   ├── views/             # EJS templates
│   ├── util/              # Utility functions
│   └── config/            # Configuration
├── tests/                 # Test files
├── public/                # Static assets
└── dist/                  # Compiled output
```

## License

ISC