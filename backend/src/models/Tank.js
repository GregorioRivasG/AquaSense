// backend/src/models/Tank.js
const mongoose = require('mongoose');

const tankSchema = new mongoose.Schema({
  name: String,
  description: String,
  ubicacion: String,
  conductividad: String,
  ph: String,
  temperatura: String,
  estado: {
    type: String,
    enum: ['Normal', 'Alerta'],
    default: 'Normal'
  },
  fecha: Date
}, { timestamps: true });

module.exports = mongoose.model('Tank', tankSchema);