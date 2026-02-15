# Alumni Influencer Platform API

A Node.js/Express.js RESTful API for managing an alumni influencer platform. This API enables alumni to connect, collaborate, and build influence within their network.

## Features

- **Express.js Framework**: Fast and minimalist web framework for Node.js
- **Environment Configuration**: Support for multiple environment configurations (local, production)
- **Request Logging**: Morgan middleware for HTTP request logging
- **Cookie Parsing**: Built-in cookie parsing support
- **Static File Serving**: Serve static files from the public directory
- **View Engine**: Pug template engine for server-side rendering
- **Error Handling**: Centralized error handling middleware

## Tech Stack

- **Runtime**: Node.js (v14+)
- **Framework**: Express.js ~4.16.1
- **Template Engine**: Pug 2.0.0-beta11
- **Middleware**:
  - morgan ~1.9.1 (HTTP request logger)
  - cookie-parser ~1.4.4 (Cookie parsing)
- **Environment Management**: dotenv ^17.3.1
- **Error Handling**: http-errors ~1.6.3

## Project Structure

```
alumni-influencer-platform-api/
├── bin/
│   └── www                    # Application startup script
├── public/                    # Static files
│   ├── images/               # Image assets
│   ├── javascripts/          # Client-side JavaScript
│   └── stylesheets/          # CSS styles
├── src/
│   ├── controllers/          # Route controllers (business logic)
│   ├── routes/               # API route definitions
│   ├── services/             # Business logic and utilities
│   └── utils/
│       └── logger.js         # Logging utilities
├── views/                    # Pug templates
│   ├── layout.pug           # Main layout template
│   ├── index.pug            # Home page template
│   └── error.pug            # Error page template
├── env/                      # Environment configuration files
├── app.js                    # Express app initialization
├── server.js                 # Server startup entry point
├── package.json              # Project dependencies and scripts
└── README.md                 # This file
```

## Installation

### Prerequisites

- Node.js v14 or higher
- npm (Node Package Manager)

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd alumni-influencer-platform-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create an environment file in the `env/` directory:
   ```bash
   touch env/.env.local
   ```

   Add the following configuration (adjust as needed):
   ```
   NODE_ENV=local
   PORT=3000
   ```

## Running the Application

### Development Mode

Start the server in local/development environment:
```bash
npm start
```

Expected output:
```
Server running on port 3000
```

The server will be accessible at `http://localhost:3000`

### Production Mode

Start the server in production environment:
```bash
npm run start:prod
```

This will load environment variables from `env/.env.prod`

## API Endpoints

### Home Page
- **GET** `/`
  - Returns the home page rendered with the Pug template
  - Response: HTML page with title "Express"

## Configuration

The application uses dotenv for environment configuration with support for multiple environments:

### Environment Files

Create the following files in the `env/` directory:

- **`env/.env.local`** - Development environment variables (default)
- **`env/.env.prod`** - Production environment variables

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | `local` | Environment mode (local, dev, prod) |
| `PORT` | `3000` | Server port number |

## Development

### Project Architecture

The project follows a modular architecture:

```
Routes (src/routes/)
   ↓
Controllers (src/controllers/)
   ↓
Services (src/services/)
   ↓
Utilities & Helpers (src/utils/)
```

### Adding New Routes

1. Create a new route file in `src/routes/`
2. Define route handlers
3. Import and use in `app.js`

Example:
```javascript
var express = require('express');
var router = express.Router();

router.get('/alumni', function(req, res) {
  res.json({ message: 'Alumni list' });
});

module.exports = router;
```

### Adding Controllers

Controllers contain business logic for route handlers. Place them in `src/controllers/`.

### Adding Services

Services contain reusable business logic and data access operations. Place them in `src/services/`.

## Logging

The application uses Morgan middleware for HTTP request logging. Logs are output in 'dev' format, providing:
- HTTP method
- Route path
- Status code
- Response time
- Request size

Custom logging utilities are available in `src/utils/logger.js`

## Error Handling

The application includes centralized error handling:
- 404 errors are caught and forwarded to the error handler
- All errors are logged with status code and message
- Error pages are rendered using the Pug template engine

## Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start server in local/development mode (PORT 3000) |
| `npm run start:prod` | Start server in production mode |

## Troubleshooting

### Module Not Found: 'dotenv'

If you encounter an error like "Cannot find module 'dotenv'":

```bash
npm install
```

Make sure dependencies are properly installed.

### Port Already in Use

If port 3000 is already in use, specify a different port:
```bash
PORT=3001 npm start
```

### Missing Environment Files

Ensure the `env/` directory exists and contains the appropriate `.env` files for your environment.

## Security Considerations

- Keep `.env` files out of version control (add to `.gitignore`)
- Never commit sensitive credentials or API keys
- Use environment variables for all configuration
- Validate and sanitize all user inputs
- Use HTTPS in production environments

## Future Enhancements

- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] Authentication & Authorization (JWT)
- [ ] Alumni profile management
- [ ] Influencer collaboration features
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Unit and integration tests
- [ ] Deployment configuration (Docker, CI/CD)

## Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## License

This project is private. All rights reserved.

## Support

For issues or questions, please contact the development team or create an issue in the project repository.

---

**Last Updated**: February 2026
**Version**: 0.0.0
