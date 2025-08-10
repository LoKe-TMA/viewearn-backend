const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  telegramId: { type: String, required: true, unique: true },
  username: String,
  first_name: String,
  balance: { type: Number, default: 0 },
  referralId: String,
  referredBy: String,
  earnings: {
    ads: { type: Number, default: 0 },
    tasks: { type: Number, default: 0 },
    referrals: { type: Number, default: 0 },
  },
  adHistory: [{
    date: String,
    count: { type: Number, default: 0 }
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
