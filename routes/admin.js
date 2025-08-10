const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Withdrawal = require('../models/Withdrawal');

// GET: Admin Dashboard
router.get('/', async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 }).limit(50);
  const withdrawals = await Withdrawal.find().sort({ createdAt: -1 }).limit(50);
  res.render('admin', { users, withdrawals });
});

// Approve Withdrawal
router.post('/withdrawals/:id/approve', async (req, res) => {
  await Withdrawal.findByIdAndUpdate(req.params.id, { status: 'approved' });
  res.redirect('/admin');
});

// Reject Withdrawal
router.post('/withdrawals/:id/reject', async (req, res) => {
  await Withdrawal.findByIdAndUpdate(req.params.id, { status: 'rejected' });
  res.redirect('/admin');
});

module.exports = router;
