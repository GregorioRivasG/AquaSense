const express = require('express');
const router = express.Router();
const Measurement = require('../models/Measurement');
const { 
  createMeasurement,
  getMeasurements
} = require('../controllers/measurements');

// Measurement routes
router.post('/measurements', createMeasurement);
router.get('/measurements', getMeasurements);


router.get('/measurements/latest', async (req, res) => {
  try {
    const measurement = await Measurement.findOne()
      .sort({ timestamp: -1 })
      .limit(1);
    res.json(measurement);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;