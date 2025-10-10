const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: '4h' } // Expira en 4h
});

module.exports = mongoose.model('Session', SessionSchema);
