# 📖 Expense Tracker API Documentation

**Base URL:**  
```
http://localhost:5000/api
```

> ⚠️ All protected routes require the header:  
```
Authorization: Bearer <JWT_TOKEN>
```

---

## 🔐 Authentication

### Register  
**POST** `/auth/register`

Register a new user.

#### Request Body
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "mypassword"
}
```

#### Response `201 Created`
```json
{ "message": "User registered successfully" }
```

#### Errors
- `500 Internal Server Error` — registration failed

---

### Login  
**POST** `/auth/login`

Log in with either email **or** username + password.

#### Request Body (by email)
```json
{ "email": "john@example.com", "password": "mypassword" }
```

#### Request Body (by username)
```json
{ "name": "John Doe", "password": "mypassword" }
```

#### Response `200 OK`
```json
{ "token": "<JWT_TOKEN>" }
```

#### Errors
- `401 Unauthorized` — invalid credentials  
- `500 Internal Server Error` — login failed

---

## 👤 Users  _(Protected)_

> All routes below require `Authorization: Bearer <token>`.

### Get All Users  
**GET** `/users`

#### Response `200 OK`
```json
[
  { "_id": "66e5...", "name": "John Doe", "email": "john@example.com" }
]
```

#### Errors
- `500 Internal Server Error` — users not found

---

### Get User by ID  
**GET** `/users/:id`

#### Response `200 OK`
```json
{
  "_id": "66e5...",
  "name": "John Doe",
  "email": "john@example.com"
}
```

#### Errors
- `404 Not Found` — user not found  
- `500 Internal Server Error` — error retrieving user

---

### Update User by ID  
**PUT** `/users/:id`

Only the authenticated user can update **their own** record.

#### Request Body (all fields optional)
```json
{ "name": "New Name", "email": "new@example.com", "password": "newpass" }
```

#### Response `200 OK`
```json
{
  "_id": "66e5...",
  "name": "New Name",
  "email": "new@example.com"
}
```

#### Errors
- `403 Forbidden` — cannot update another user  
- `404 Not Found` — user not found  
- `500 Internal Server Error` — update error

---

### Delete User by ID  
**DELETE** `/users/:id`

Only the authenticated user can delete **their own** record.

#### Response `200 OK`
```json
{ "message": "User successfully deleted" }
```

#### Errors
- `403 Forbidden` — unauthorized user  
- `404 Not Found` — user not found  
- `500 Internal Server Error` — deletion error

---

## 💰 Expenses  _(Protected)_

> All routes below require `Authorization: Bearer <token>`.

### Get All Expenses  
**GET** `/expenses`

Returns the authenticated user’s expenses. Supports filters + pagination.

#### Query Parameters
- `from` (ISO date string, optional) — inclusive start  
- `to` (ISO date string, optional) — inclusive end (entire day included)  
- `category` (string, optional)  
- `type` (`income` | `expense` | `transfer`, optional)  
- `q` (string, optional) — case-insensitive search in `merchant` and `note`  
- `limit` (number, default 50, max 200)  
- `skip` (number, default 0)

#### Example Request
```
GET /expenses?category=food&q=chipotle&from=2025-09-01&to=2025-09-30
Authorization: Bearer <token>
```

#### Example Response `200 OK`
```json
[
  {
    "_id": "66e5...",
    "user": "66e5...",
    "amount": 12.5,
    "currency": "USD",
    "category": "food",
    "type": "expense",
    "date": "2025-09-14T14:00:00.000Z",
    "merchant": "Chipotle",
    "note": "Lunch bowl"
  }
]
```

#### Errors
- `500 Internal Server Error` — server error

---

### Add Expense  
**POST** `/expenses`

Create a new expense for the authenticated user.

#### Request Body
```json
{
  "amount": 15.0,
  "currency": "USD",
  "category": "food",
  "type": "expense",
  "date": "2025-09-14",
  "merchant": "Starbucks",
  "note": "Coffee and bagel"
}
```

#### Response `201 Created`
```json
{
  "_id": "66e5...",
  "amount": 15.0,
  "currency": "USD",
  "category": "food",
  "type": "expense",
  "date": "2025-09-14T00:00:00.000Z",
  "merchant": "Starbucks",
  "note": "Coffee and bagel"
}
```

#### Errors
- `400 Bad Request` — validation failed  
- `500 Internal Server Error` — server error

---

### Summary by Category  
**GET** `/expenses/summary/category`

Groups totals by category. Accepts optional date filters.

#### Query Parameters
- `from` (ISO date string, optional)  
- `to` (ISO date string, optional)

#### Example Request
```
GET /expenses/summary/category?from=2025-09-01&to=2025-09-30
Authorization: Bearer <token>
```

#### Example Response `200 OK`
```json
[
  { "_id": "food", "total": 250.75, "count": 12 },
  { "_id": "rent", "total": 1200, "count": 1 }
]
```

#### Errors
- `500 Internal Server Error` — failed to summarize expenses

---

### Delete Expense  
**DELETE** `/expenses/delete/:id`

Deletes a single expense owned by the authenticated user.

#### Example Request
```
DELETE /expenses/delete/66e58d9a9c1d5a1234567890
Authorization: Bearer <token>
```

#### Response `200 OK`
```json
{ "message": "Expense successfully deleted" }
```

#### Errors
- `404 Not Found` — expense not found  
- `400 Bad Request` — invalid ID

---

## 🔒 Protected Test Route  _(Protected)_

**GET** `/protected`

A convenience route to verify that a valid JWT is being sent.

#### Response `200 OK`
```json
{ "message": "Protected route accessed" }
```

---

# 🧩 Implementation Notes

## Prerequisites
- Node.js + npm installed
- MongoDB connection string in `.env` (`MONGODB_URI`)
- JWT secret in `.env` (`JWT_SECRET`)

## Install & Run
```bash
npm install
npm run dev
# or: node server.js / node app.js depending on your entry file
```

## Secure Middleware (Recommended)
```js
const helmet = require('helmet');
const cors = require('cors');

app.use(helmet());
app.use(cors({
  origin: 'http://localhost:3000',          // frontend URL
  methods: ['GET','POST','PUT','PATCH','DELETE'],
  allowedHeaders: ['Content-Type','Authorization']
}));
```

## Mounting Routes (Example)
```js
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/expenses', require('./routes/expenseRoutes'));
app.use('/api/protected', require('./routes/protectedRoute'));
```

## Testing with curl
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"pass"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"pass"}'
# -> copy the token below

# Create expense
curl -X POST http://localhost:5000/api/expenses \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"amount":12.5,"currency":"USD","category":"food","type":"expense","merchant":"Chipotle"}'

# List expenses (search + filters)
curl -X GET "http://localhost:5000/api/expenses?q=chipotle&category=food" \
  -H "Authorization: Bearer <TOKEN>"
```

## Conventions
- All dates should be ISO 8601 strings (e.g., `2025-09-14` or `2025-09-14T15:30:00.000Z`).
- Amounts are rounded to two decimals by the model.
- All expense endpoints are scoped to the authenticated user via JWT.
- Delete endpoints do not require a request body—pass the `:id` in the path.

---

Happy building! 🚀
