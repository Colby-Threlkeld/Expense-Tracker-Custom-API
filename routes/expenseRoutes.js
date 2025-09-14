const express = require('express');
const router = express.Router();

const  {
    getAllExpenses,
    addExpense,
    summaryByCategory,
    deleteExpense
} = require('../controllers/expenseController');

const verifyToken = require('../middleware/authMiddleware');

router.use(verifyToken); // requires jwt token for each route

// GET all expenses for authenticated user
router.get('/', getAllExpenses);

// GET summary of totals by category of expenses
router.get('/summary/category', summaryByCategory);

// CREATE/POST a new expense
router.post('/', addExpense);

// DELETE an expense for authenticated user by ID
router.delete('/delete/:id', deleteExpense);


module.exports = router;
