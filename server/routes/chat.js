const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// POST /api/chat/message — REST fallback for chat history
router.post('/message', protect, async (req, res) => {
  res.json({ message: 'Use Socket.io for real-time chat', room: req.body.room });
});

module.exports = router;
