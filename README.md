# Alumni Influencer Platform API

A Node.js/Express.js RESTful API for the University of Eastminster's Alumni Influencer Platform. The platform enables alumni to create profiles, participate in a blind bidding system to become "Alumni of the Day", and allows external developers to access alumni data via API keys.

## Features

- **Alumni Registration & Authentication** — Email-based registration with university domain validation, OTP email verification, JWT access/refresh token authentication, password reset flow
- **Alumni Profile Management** — Personal info, biography, LinkedIn profile, degrees, certifications, licences, professional courses, employment history, and Cloudinary profile image upload
- **Blind Bidding System** — Daily bidding for featured "Alumni of the Day" slot, blind bidding with win/lose feedback, monthly win limits, automated winner selection via cron job
- **Security** — JWT bearer tokens, refresh token rotation, token blacklisting, role-based access control, bcrypt password hashing, input validation, rate limiting
- **Public Developer API** — API key authentication for external clients, usage statistics, key revocation
- **Swagger Documentation** — Interactive API documentation at `/api-docs`

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL via Sequelize ORM
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **Email**: Nodemailer with Gmail
- **Image Upload**: Cloudinary + Multer
- **Scheduling**: node-cron
- **Documentation**: Swagger UI (swagger-jsdoc + swagger-ui-express)
- **Logging**: Winston

## Project Structure

```
alumni-influencer-platform-api/
├── src/
│   ├── config/               # Sequelize, Cloudinary, Swagger config
│   ├── controllers/          # MVC controllers (business logic + DB access)
│   │   ├── authController.js
│   │   ├── profileController.js
│   │   ├── biddingController.js
│   │   └── utilitiesController.js
│   ├── jobs/                 # Cron jobs
│   │   ├── index.js          # Job scheduler (runs daily at 18:00)
│   │   └── winnerSelection.job.js
│   ├── middleware/           # Express middleware
│   │   └── authMiddleware.js # JWT verification + role-based access
│   ├── models/               # Sequelize models
│   │   ├── users.js
│   │   ├── userDetails.js
│   │   ├── userRoles.js
│   │   ├── userRoleUserMapping.js
│   │   ├── degrees.js
│   │   ├── certifications.js
│   │   ├── licences.js
│   │   ├── professionalCourses.js
│   │   ├── employmentHistory.js
│   │   ├── profileImages.js
│   │   ├── refreshToken.js
│   │   ├── tokenBlacklist.js
│   │   ├── bids.js
│   │   ├── alumniOfTheDay.js
│   │   └── alumniEvents.js
│   ├── routes/               # Express routers with Swagger docs
│   │   ├── index.js
│   │   ├── users.router.js
│   │   ├── profile.router.js
│   │   ├── bidding.router.js
│   │   └── utilities.router.js
│   └── utils/                # Shared utilities
│       ├── logger.js         # Winston logger
│       ├── emailUtil.js      # Nodemailer email sending
│       ├── encryption.js     # bcrypt hashing
│       ├── jwtUtil.js        # JWT token generation/verification
│       ├── otp.js            # OTP generation
│       ├── constants.js      # Environment variable constants
│       ├── enums.js          # Application enums
│       └── templates/        # Email HTML templates
├── env/                      # Environment files (gitignored)
│   └── .env.local            # Local environment variables
├── resources/                # Dummy images for testing
├── app.js                    # Express app setup
├── server.js                 # Server entry point
├── vercel.json               # Vercel deployment config
├── .env.example              # Environment variable template
├── package.json
└── README.md
```

## Installation

### Prerequisites

- Node.js v18 or higher
- MySQL 8.0 or higher
- npm

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
   ```bash
   cp .env.example env/.env.local
   ```
   Fill in the values in `env/.env.local` — see [Environment Variables](#environment-variables) below.

4. **Create the database**
   ```bash
   mysql -u root -p
   CREATE DATABASE alumni-platform-db-dev;
   ```

5. **Start the server**
   ```bash
   npm start
   ```
   The server will sync all models automatically on startup.

## Environment Variables

Create `env/.env.local` with the following variables (see `.env.example` for reference):

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 3000) |
| `DB_HOST` | MySQL host |
| `DB_PORT` | MySQL port (default: 3306) |
| `DB_USER` | MySQL username |
| `DB_PASSWORD` | MySQL password |
| `DB_NAME` | Database name |
| `DB_DIALECT` | Database dialect (`mysql`) |
| `BCRYPT_ROUNDS` | bcrypt salt rounds (default: 12) |
| `JWT_SECRET` | JWT access token secret |
| `JWT_EXPIRES_IN` | JWT access token expiry (e.g. `1h`) |
| `JWT_REFRESH_SECRET` | JWT refresh token secret |
| `JWT_REFRESH_EXPIRES_IN` | JWT refresh token expiry (e.g. `7d`) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `EMAIL_USER` | Gmail address for sending emails |
| `EMAIL_PASSWORD` | Gmail app password |
| `ALLOWED_EMAIL_DOMAINS` | Comma-separated allowed domains (e.g. `iit.ac.lk,eastminster.ac.uk`) |

## Running the Application

```bash
# Local development
npm start

# Production
npm run start:prod
```

## API Documentation

Once the server is running, visit:
```
http://localhost:3000/api-docs
```

Interactive Swagger UI with all endpoints documented.

## API Overview

### Authentication (`/api/users`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/create-user` | Public | Register new alumni |
| POST | `/verify-email` | Public | Verify email with OTP |
| GET | `/resend-otp` | Public | Resend verification OTP |
| POST | `/login` | Public | Login and get tokens |
| POST | `/logout` | Bearer | Logout and invalidate tokens |
| POST | `/refresh` | Public | Refresh access token |
| POST | `/forgot-password` | Public | Send password reset OTP |
| POST | `/verify-forgot-password-otp` | Public | Verify reset OTP |
| POST | `/reset-password` | Public | Reset password |
| POST | `/change-password` | Bearer | Change password |
| GET | `/user-details` | Public | Get all alumni profiles |

### Profile (`/api/profile`)

| Method | Endpoint          | Auth | Description               |
|--------|-------------------|------|---------------------------|
| POST | `/personal`       | Bearer | Create personal info      |
| PUT | `/personal`       | Bearer | Update personal info      |
| GET | `/user-details`   | Bearer | Get all user details      |
| POST | `/qualifications` | Bearer | Add qualifications        |
| PUT | `/qualifications` | Bearer | Update qualifications     |
| GET | `/qualifications` | Bearer | Get qualifications        |
| POST | `/employment`     | Bearer | Add employment history    |
| PUT | `/employment`     | Bearer | Update employment history |
| GET | `/employment`     | Bearer | Get employment history    |
| POST | `/image`          | Bearer | Upload profile image      |
| GET | `/image`          | Bearer | Get profile image         |

### Bidding (`/api/bidding`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/place` | Bearer | Place or update a bid |
| GET | `/status` | Bearer | Get bid status (winning/losing) |
| GET | `/history` | Bearer | Get bid history |
| GET | `/monthly-limit` | Bearer | Get monthly win limit status |
| GET | `/tomorrow` | Bearer | Get tomorrow's slot info |
| GET | `/alumni-of-the-day/:date` | Public | Get alumni of the day |

### Utilities (`/api/utilities`)

| Method | Endpoint | Auth | Description                                      |
|--------|----------|------|--------------------------------------------------|
| POST | `/hashing` | Bearer | Hash a string (testing only)                     |
| POST | `/trigger-winner-selection` | Public | Manually trigger winner selection (testing only) |

## Architecture

This project follows the **MVC (Model-View-Controller)** pattern:

- **Model** — Sequelize models define the database schema and relationships
- **View** — JSON responses (REST API, client agnostic)
- **Controller** — Express controllers handle requests, business logic, and direct DB access via Sequelize models

### Security Implementation

- Passwords hashed with **bcrypt** (12 salt rounds)
- **JWT access tokens** (1 hour expiry) sent in Authorization header
- **JWT refresh tokens** (7 days) stored in httpOnly cookies
- **Token blacklist** — revoked access tokens stored in DB until expiry
- **Role-based access control** — `ALUMNI` and `DEVELOPER` roles enforced via middleware
- University domain validation on registration

### Bidding System

- Alumni bid for a 24-hour featured slot (Alumni of the Day)
- **Blind bidding** — bidders see winning/losing status but not the actual highest bid
- Bids can only be increased, never decreased
- Winner selected daily at **6 PM (Europe/London)** via cron job
- Monthly win limit: **3 wins per month** (4 with alumni event attendance)
- Winner receives email notification

## Cron Jobs

| Job | Schedule | Description |
|-----|----------|-------------|
| Winner Selection | Daily at 18:00 (Europe/London) | Selects highest eligible bidder for next day's slot |

## Branches

| Branch | Description |
|--------|-------------|
| `main` | Production-ready branch |
| `intermediate` | Common integration branch for all ongoing changes |
| `feature/*` | Feature branches created from `intermediate` |

## License

This project is private. All rights reserved.

---

- **Module**: 6COSC022C.2 Advanced Server Side Web Development
- **Institution**: University of Westminster / Informatics Institute of Technology (IIT)
- **Academic Year**: 2025/26
