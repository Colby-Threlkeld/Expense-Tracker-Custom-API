### Expense Tracker Custom API
## 📌 Overview

A custom Node.js + Express + MongoDB (w/ Mongoose ODM) API for tracking expenses with secure JWT authentication.
Users can register, log in with their name or email, and access protected endpoints (e.g., expenses).

This project demonstrates:

User authentication & password hashing

Role of protected routes

CRUD operations for expense tracking

Clean project structure with controllers, routes, models, middleware, and utils

## - API Documentation -

See [API_DOCS.md](./API_DOCS.md) for full endpoint documentation.

## - Features -

User Registration (with name, email, and password)

Login (by name or email + password)

JWT Authentication (secure, token-based sessions)

Protected Routes (accessible only with a valid token)

Expense Endpoints (create, view, delete expenses linked to a user)

Environment-based secrets (.env for DB + JWT secret)

## - Tech Stack -

Backend: Node.js, Express

Database: MongoDB (Mongoose ODM)

Authentication: JWT, bcryptjs

Dev Tools: Nodemon, dotenv

Version Control: Git + GitHub
