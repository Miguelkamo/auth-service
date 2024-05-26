const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const config = require('./config');

const app = express();

app.use(express.json());

mongoose.connect(config.db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB conectado'))
    .catch(err => console.error(err));

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor iniciado en el puerto ${PORT}`));


