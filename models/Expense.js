const mongoose = require('mongoose');

function roundToTwo(value) {
  return Math.round(value * 100) / 100;
}

const CATEGORIES = ['food', 'groceries', 'rent', 'transport', 'subscriptions',
    'health', 'education', 'entertainment', 'utilities', 'travel', 'other'];

const TYPE = [ 'income', 'expense', 'transfer' ];
const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'RON'];

const expenseSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true,
        min: [0.01, 'Please enter an amount greater than 0'],
        set: roundToTwo // calls function rounding to 2 decimal places
    },

    currency: {
        type: String,
        enum: CURRENCIES,
        default: 'USD',
    },
    
    category: {
        type: String,
        enum: CATEGORIES,
        required: true,
        lowercase: true,
        trim: true
    },

    type: {
        type: String,
        enum: TYPE,
        required: true,
        lowercase: true,
        trim: true,
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },

    date: {
        type: Date,
        default: Date.now
    },

    merchant: { type: String, trim: true },
  note: { type: String, trim: true, maxlength: 500 },

}, {
  timestamps: true,
  versionKey: false,
  toJSON: {
    transform: (_, ret) => {
      return ret;
    }
  }
});

// Business rule: only allow zero amount if it's a transfer
expenseSchema.path('amount').validate(function (val) {
  if (this.type === 'transfer') return val >= 0; // allow 0 for transfers
  return val > 0; // income/expense must be > 0
}, 'Amount must be > 0 (or 0 for transfers).');

// Helpful indexes for common queries and dashboards
expenseSchema.index({ user: 1, date: -1 });
expenseSchema.index({ user: 1, category: 1, date: -1 });




const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;