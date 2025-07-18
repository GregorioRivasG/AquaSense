const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    correo: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fotoUrl: { type: String },
    role: { type: String, enum: ['admin', 'employee'], default: 'employee' },
  },
  {
    timestamps: true, // crea createdAt y updatedAt automáticos
  }
);

module.exports = mongoose.model('User', UserSchema);
