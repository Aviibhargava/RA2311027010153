const express = require('express');
const { Log } = require('../logging_middleware/logger');

const app = express();
app.use(express.json());

// In-memory storage
let notifications = [];
let idCounter = 1;

// GET all notifications
app.get('/notifications', async (req, res) => {
  try {
    await Log('backend', 'info', 'handler', 'Fetching all notifications');
    res.status(200).json({ notifications });
  } catch (err) {
    await Log('backend', 'error', 'handler', `Error fetching notifications: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
});

// POST create notification
app.post('/notifications', async (req, res) => {
  try {
    const { title, message, type } = req.body;

    if (!title || !message || !type) {
      await Log('backend', 'warn', 'handler', 'Missing required fields in notification');
      return res.status(400).json({ error: 'title, message and type are required' });
    }

    const notification = {
      id: idCounter++,
      title,
      message,
      type,
      createdAt: new Date().toISOString()
    };

    notifications.push(notification);
    await Log('backend', 'info', 'service', `Notification created: ${title} of type ${type}`);
    res.status(201).json({ notification });
  } catch (err) {
    await Log('backend', 'error', 'handler', `Error creating notification: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
});

// GET notification by ID
app.get('/notifications/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const notification = notifications.find(n => n.id === id);

    if (!notification) {
      await Log('backend', 'warn', 'handler', `Notification not found: ${id}`);
      return res.status(404).json({ error: 'Notification not found' });
    }

    await Log('backend', 'info', 'handler', `Fetched notification: ${id}`);
    res.status(200).json({ notification });
  } catch (err) {
    await Log('backend', 'error', 'handler', `Error fetching notification: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
});

// DELETE notification by ID
app.delete('/notifications/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const index = notifications.findIndex(n => n.id === id);

    if (index === -1) {
      await Log('backend', 'warn', 'handler', `Notification not found for delete: ${id}`);
      return res.status(404).json({ error: 'Notification not found' });
    }

    notifications.splice(index, 1);
    await Log('backend', 'info', 'service', `Notification deleted: ${id}`);
    res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (err) {
    await Log('backend', 'error', 'handler', `Error deleting notification: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3001, async () => {
  await Log('backend', 'info', 'config', 'Notification service running on port 3001');
  console.log('Notification server running on http://localhost:3001');
});
