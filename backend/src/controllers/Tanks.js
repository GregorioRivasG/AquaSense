const Tank = require('../models/Tank');

exports.createTank = async (req, res) => {
  try {
    console.log('Datos que llegan al backend:', req.body);  // Log datos recibidos
    const data = { ...req.body, fecha: new Date() };         // Asignar fecha actual aquí
    const tank = new Tank(data);
    const saved = await tank.save();
    console.log('Pecera guardada:', saved);                  // Log pecera guardada
    res.status(201).json(saved);
  } catch (err) {
    console.error('Error guardando pecera:', err);           // Log error en guardado
    res.status(400).json({ error: err.message });
  }
};

exports.getTanks = async (req, res) => {
  try {
    const tanks = await Tank.find();
    res.json(tanks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTankById = async (req, res) => {
  try {
    const tank = await Tank.findById(req.params.id);
    if (!tank) return res.status(404).json({ message: 'Pecera no encontrada' });
    res.json(tank);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateTank = async (req, res) => {
  try {
    const data = { ...req.body, fecha: new Date() };         // Asignar fecha actual aquí al actualizar
    const updated = await Tank.findByIdAndUpdate(
      req.params.id,
      data,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: 'Pecera no encontrada' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteTank = async (req, res) => {
  try {
    const deleted = await Tank.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Pecera no encontrada' });
    res.json({ message: 'Pecera eliminada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
