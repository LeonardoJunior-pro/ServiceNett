const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const customerSchema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  createdBy: { type: mongoose.Schema.ObjectId, ref: 'Admin', required: true },
  name: {
    type: String,
    trim: true,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
  },
  contacts: [
    {
      name: {
        type: String,
        trim: true,
        required: true,
      },
      email: {
        type: String,
        trim: true,
        lowercase: true,
      },
      phone: {
        type: String,
        required: true,
      },
    },
  ],
  equipments: [{ type: mongoose.Schema.ObjectId, ref: 'Equipment', required: true }],
  equipmentCount: {
    type: Number,
    default: 0,
  },
  primaryContact: {
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

module.exports = mongoose.model('Customer', customerSchema);
