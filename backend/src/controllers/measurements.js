const Measurement = require('../models/Measurement');

// @desc    Create a new measurement
// @route   POST /api/measurements
// @access  Public
exports.createMeasurement = async (req, res) => {
  try {
    const { tankId, temperature, ph, conductivity } = req.body;
    
    const newMeasurement = new Measurement({
      tankId,
      temperature,
      ph,
      conductivity
    });

    const measurement = await newMeasurement.save();
    res.json(measurement);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get all measurements
// @route   GET /api/measurements
// @access  Public
exports.getMeasurements = async (req, res) => {
  try {
    const measurements = await Measurement.find().sort({ timestamp: -1 });
    res.json(measurements);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};