const Expense = require('../models/Expense');

// Controller function to GET all expenses
async function getAllExpenses(req, res) {
  try {
    const { from, to, category, type, limit = 50, skip = 0, q } = req.query;

    const filter = { user: req.userId };

    // filters if present
    if (category) filter.category = category;
    if (type) filter.type = type;
    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = new Date(from);
      if (to)   filter.date.$lte = new Date(to);
    }

    if (q) {
      const regex = new RegExp(q, 'i'); // case-insensitive
      filter.$or = [
        { merchant: regex },
        { note: regex }
      ];
    }

    const expenses = await Expense.find(filter)
      .sort({ date: -1, _id: -1 })     // newest first and _id as tiebreaker
      .skip(Number(skip))               // pagination offset
      .limit(Math.min(Number(limit), 200)) // cap page size
      .lean();                          // return plain JS objects, for faster speed

    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
}

// Groups totals by category for the user; accepts from/to
const mongoose = require('mongoose');

// Groups totals by category for the user; accepts from/to
async function summaryByCategory(req, res) {
  try {
    const { from, to } = req.query;

    // Cast user id for aggregation
    const userId = new mongoose.Types.ObjectId(req.userId);

    const match = { user: userId };

    if (from || to) {
      match.date = {};
      if (from) match.date.$gte = new Date(from); // start of day UTC
      if (to) {
        const end = new Date(to);
        end.setHours(23, 59, 59, 999);            // include entire 'to' day
        match.date.$lte = end;
      }
    }

    const rows = await Expense.aggregate([
      { $match: match },
      { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } },
      { $sort: { total: -1 } }
    ]);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to summarize expenses' });
  }
}

// Controller function to CREATE/POST a new expense
async function addExpense(req, res) {
  const { amount, category, type, date, merchant, note, currency } = req.body;

  try {
    const expense = await Expense.create({
      user: req.userId,
      amount,
      category,
      type,
      date,
      merchant,
      note,
      currency
    });

    res.status(201).json(expense);
  } catch (error) {
    // surface validation errors as 400s
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Server Error' });
  }
}

// Controller function to DELETE an expense by ID
async function deleteExpense(req, res) {
    try {
    // single atomic op avoids TOCTOU + double roundtrip
    const deleted = await Expense.findOneAndDelete({
      _id: req.params.id,
      user: req.userId
    });

    if (!deleted) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    res.json({ message: 'Expense successfully deleted' });
  } catch (error) {
    res.status(400).json({ error: 'Invalid ID' });
  }
}

module.exports = { 
    getAllExpenses,
    addExpense,
    deleteExpense,
    summaryByCategory
};