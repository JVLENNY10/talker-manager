const { Router } = require('express');

const checkEmail = require('../middlewares/checkEmail');
const generateToken = require('../helpers/generateToken');
const checkPassword = require('../middlewares/checkPassword');

const route = Router();

route.post('/login', checkEmail, checkPassword, (_req, res) => (
  res.status(200).json({ token: generateToken() })
));

module.exports = route;
