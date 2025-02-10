const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const equipmentSchema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  createdBy: { type: mongoose.Schema.ObjectId, ref: 'Customer', required: true },
  name: {
    type: String,
    trim: true,
    required: true,
  },
  serial: {
    type: String,
    trim: true,
    required: true,
  },
  interval: {
    type: Number,
    required: true,
  },
  lastDate: {
    type: Date,
    default: Date.now,
  },
  nextDate: {
    type: Date,
    required: true,
  },
  contact: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
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

module.exports = mongoose.model('Equipment', equipmentSchema);
