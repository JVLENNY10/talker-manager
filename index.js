const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});

// Requisito 1
app.get('/talker', (_req, res) => {
  fs.readFile('./talker.json', 'utf8')
    .then((response) => res.status(200).json(JSON.parse(response)));
});

// Requisito 2
app.get('/talker/:id', (req, res) => {
  fs.readFile('./talker.json', 'utf8')
    .then((response) => {
      const { id } = req.params;
      const talkers = JSON.parse(response);
      const result = talkers.find((talker) => talker.id === parseInt(id, 10));

      if (!result) return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });

      return res.status(200).json(result);
    });
});

// Requisito 3

// Desenvolvi minha solução com informações desses sites:
// https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Math/round
// https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Math/random
// https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Number/toString

// Lembrei do toString por conta desse site:
// https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript

const generateToken = () => {
  const token1 = Math.round(Math.random() * 999999999999).toString(36);
  const token2 = Math.round(Math.random() * 999999999999).toString(36);
  const finalToken = token1 + token2;

  if (finalToken.length === 16) return finalToken;

  return generateToken();
};

const checkEmail = (email, res) => {
  if (!email) {
    return res.status(400).json({ message: 'O campo "email" é obrigatório' });
  } if (!email.includes('@') || !email.includes('.com')) {
    return res.status(400).json({ message: 'O "email" deve ter o formato "email@email.com"' });
  }
};

const checkPassword = (password, res) => {
  if (!password) {
    return res.status(400).json({ message: 'O campo "password" é obrigatório' });
  } if (password.length < 6) {
    return res.status(400).json({ message: 'O "password" deve ter pelo menos 6 caracteres' });
  }
};

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  checkEmail(email, res);
  checkPassword(password, res);
  res.status(200).json({ token: generateToken() });
});
