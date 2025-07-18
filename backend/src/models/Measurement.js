const mongoose = require('mongoose');

const MeasurementSchema = new mongoose.Schema({
  tankId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tank',
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  temperature: {
    type: Number,
    required: true
  },
  ph: {
    type: Number,
    required: true
  },
  conductivity: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Measurement', MeasurementSchema);