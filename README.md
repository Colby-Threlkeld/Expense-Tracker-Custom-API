## 💸 Expense Tracker Custom API Overview

The Expense Tracker Custom API is a backend service built with Node.js, Express, and MongoDB (Mongoose ODM).
It provides secure JWT-based authentication and CRUD operations for expense management.

This project demonstrates:

User authentication & password hashing with bcryptjs

Protected routes using JWT middleware

Full CRUD operations for expenses & Users

Clean & scalable modular project structure (controllers, routes, models, middleware, utils)


## - API Documentation -

Full API reference with request/response examples can be found in [API_DOCS.md](./API_DOCS.md) 


## - Features -

  -User Registration (with name, email, and password)

  -Login (by name or email + password)

  -JWT Authentication (secure, token-based sessions)

  -Protected Routes (accessible only with a valid token)

  -Expense Endpoints (create, view, delete expenses linked to a user)

  -Environment-based secrets (.env for DB connection + JWT secret)

## - Tech Stack -

Language: JavaScript

Backend: Node.js, Express

Database: MongoDB (Mongoose ODM) MongoDB Atlas

Authentication: JWT, bcryptjs

Dev Tools: Nodemon, dotenv, Postman (Testing)

Version Control: Git + GitHub
