const express = require('express');
const router = express.Router();
const Plan = require('../models/Plan');
const { protect } = require('../middleware/auth');

// POST /api/plans
router.post('/', protect, async (req, res) => {
  try {
    const plan = await Plan.create({ ...req.body, userId: req.user._id });
    res.status(201).json(plan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/plans
router.get('/', protect, async (req, res) => {
  try {
    const plans = await Plan.find({ userId: req.user._id }).sort('-createdAt');
    res.json(plans);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/plans/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const plan = await Plan.findOne({ _id: req.params.id, userId: req.user._id });
    if (!plan) return res.status(404).json({ message: 'Plan not found' });
    res.json(plan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/plans/:id
router.put('/:id', protect, async (req, res) => {
  try {
    const plan = await Plan.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );
    if (!plan) return res.status(404).json({ message: 'Plan not found' });
    res.json(plan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/plans/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    await Plan.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    res.json({ message: 'Plan deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
