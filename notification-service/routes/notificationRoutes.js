const express = require('express');
const { sendOrderConfirmation, sendWelcomeEmail } = require('../services/emailService');

const router = express.Router();

// In-memory notification store (replace with MongoDB in production)
const notifications = [];
let notifId = 1;

// @desc    Create notification
// @route   POST /api/notifications
router.post('/', (req, res) => {
  try {
    const { userId, message, type = 'system', email } = req.body;
    const notification = {
      id: notifId++,
      userId,
      message,
      type,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    notifications.push(notification);

    // Optionally send email
    if (email && type === 'order') {
      sendOrderConfirmation(email, { recipeTitle: message }).catch(console.error);
    }

    res.status(201).json(notification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @desc    Get notifications for a user
// @route   GET /api/notifications/:userId
router.get('/:userId', (req, res) => {
  const userNotifs = notifications
    .filter(n => n.userId === req.params.userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(userNotifs);
});

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
router.put('/:id/read', (req, res) => {
  const notif = notifications.find(n => n.id === parseInt(req.params.id));
  if (!notif) return res.status(404).json({ error: 'Notification not found' });
  notif.isRead = true;
  res.json(notif);
});

// @desc    Send welcome email
// @route   POST /api/notifications/welcome
router.post('/welcome', async (req, res) => {
  try {
    const { email, name } = req.body;
    await sendWelcomeEmail(email, name);
    res.json({ message: 'Welcome email sent' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
