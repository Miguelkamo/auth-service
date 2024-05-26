const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config');
const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        let user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ msg: 'El usuario ya existe' });
        }

        user = new User({ username, password });
        await user.save();

        res.status(201).json({ msg: 'Usuario registrado exitosamente' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error en el servidor');
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ msg: 'Credenciales incorrectas' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Credenciales incorrectas' });
        }

        const payload = { userId: user._id };
        const token = jwt.sign(payload, config.secret, { expiresIn: '1h' });

        res.json({ token, msg: 'Autenticación satisfactoria' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error en el servidor');
    }
});

module.exports = router;
