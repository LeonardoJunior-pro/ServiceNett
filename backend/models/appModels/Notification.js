const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const notificationSchema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  equipment: { type: mongoose.Schema.ObjectId, ref: 'Equipment', required: true },
  date: {
    type: Date,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Notification', notificationSchema);
