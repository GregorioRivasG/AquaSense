require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./connectDB');
const userRoutes = require('./src/routes/users');
const tankRoutes = require('./src/routes/Tanks');
const authRoutes = require('./src/routes/auth'); // <-- NUEVO
const apiRoutes = require('./src/routes/api');
const app = express();

connectDB();

app.set('port', process.env.PORT || 5000);
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

// API base
app.get('/', (req, res) => {
  res.send('API del Acuario Piscilandia funcionando!');
});

// Rutas
app.use('/api/users', userRoutes);
app.use('/api/tanks', tankRoutes);
app.use('/api/auth', authRoutes); // <-- NUEVO
app.use('/api', apiRoutes);
app.listen(app.get('port'), () => {
  console.log(`Servidor corriendo en puerto ${app.get('port')}`);
});
