# Secure Task API

A security-focused REST API for task management built with Node.js, Express, and MongoDB.

This project demonstrates production-style authentication and security practices including JWT authentication, refresh token rotation, reuse detection, and session management.

---

## Features

- JWT Authentication
- Refresh Token Rotation
- Refresh Token Reuse Detection
- Logout (single device)
- Logout from All Devices
- Password Hashing with bcrypt
- Rate Limiting to prevent brute-force attacks
- Helmet security headers
- Suspicious request logging
- Secure HTTP-only cookies

---

## Tech Stack

- Node.js
- Express
- MongoDB (Mongoose)
- JSON Web Token (JWT)
- bcrypt
- cookie-parser
- helmet
- express-rate-limit
- morgan

---

## API Endpoints

### Authentication

POST/api/auth/signup

POST/api/auth/login

POST/api/auth/refresh

POST/api/auth/logout

POST/api/auth/logout-all

### Tasks

GET/api/tasks

POST/api/tasks

PUT/api/tasks

DELETE/api/tasks

---

## Security Architecture

This API implements multiple security layers:

- Password are hashed using bcrypt before storage.
- Refresh tokens are stored hashed in MongoDB.
- Refresh token rotation ensures stolen tokens cannot be reused.
- Reuse detection revokes all sessions if token theft is detected.
- Helmet adds HTTP security headers.
- Rate limiting prevents brute-force login attempts.

---

## Running the Project

Clone the repository:

git clone

install dependencies:

npm install

create a .env file with

MONGODB_URI=yourmongodb_connection

JWT_ACCESS_SECRET=your_secret_key

Start the server:

npm run dev

Server runs on:

http://localhost:3000
