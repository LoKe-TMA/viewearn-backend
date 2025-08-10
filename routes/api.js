const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Withdrawal = require('../models/Withdrawal');

// POST /api/login
router.post('/login', async (req, res) => {
  const { telegramId, username, first_name, referralId } = req.body;

  let user = await User.findOne({ telegramId });
  if (!user) {
    user = new User({ telegramId, username, first_name, referralId, referredBy: referralId || null });
    await user.save();
  }

  res.json(user);
});

// GET /api/balance/:id
router.get('/balance/:id', async (req, res) => {
  const user = await User.findOne({ telegramId: req.params.id });
  if (!user) return res.status(404).json({ message: "User not found" });

  res.json({ balance: user.balance, earnings: user.earnings });
});

// POST /api/reward
router.post('/reward', async (req, res) => {
  const { telegramId, type, amount } = req.body;

  const user = await User.findOne({ telegramId });
  if (!user) return res.status(404).json({ message: "User not found" });

  // Daily Ad Limit
  if (type === 'ads') {
    const today = new Date().toISOString().split('T')[0];
    const adLog = user.adHistory.find(entry => entry.date === today);
    const DAILY_LIMIT = 5;

    if (adLog) {
      if (adLog.count >= DAILY_LIMIT) {
        return res.status(403).json({ message: "Daily ad limit reached" });
      } else {
        adLog.count += 1;
      }
    } else {
      user.adHistory.push({ date: today, count: 1 });
    }
  }

  user.balance += amount;
  user.earnings[type] += amount;
  await user.save();

  res.json({ message: 'Reward added', balance: user.balance });
});

// POST /api/withdraw
router.post('/withdraw', async (req, res) => {
  const { telegramId, wallet, amount } = req.body;

  const user = await User.findOne({ telegramId });
  if (!user || user.balance < amount) return res.status(400).json({ message: "Invalid withdrawal" });

  const withdrawal = new Withdrawal({ userId: telegramId, wallet, amount });
  await withdrawal.save();

  user.balance -= amount;
  await user.save();

  res.json({ message: "Withdrawal request submitted" });
});

// GET /api/referrals/:id
router.get('/referrals/:id', async (req, res) => {
  const count = await User.countDocuments({ referredBy: req.params.id });
  res.json({ count });
});

module.exports = router;
