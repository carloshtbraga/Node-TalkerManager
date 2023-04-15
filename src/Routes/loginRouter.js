const express = require('express');

const generateToken = require('../utils/generateToken');
const loginValidation = require('../middleware/loginValidation');

const router = express.Router();

router.post('/login', loginValidation, async (req, res) => {
    const token = generateToken();
    return res.status(200).json({ token });
  });

module.exports = router;