const express = require('express');
const authRoutes = require('./routes/authRoutes');
const protectedRoute = require('./routes/protectedRoute');
const userRoutes = require('./routes/userRoutes');
const expenseRoutes = require('./routes/expenseRoutes');

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/protected', protectedRoute);
app.use('/api/users', userRoutes);
app.use('/api/expenses', expenseRoutes);

// Basic health test route
app.get('/', (req, res) => {
    res.json({ message: 'Expense Tracker API loaded properly'})
});

module.exports = app;