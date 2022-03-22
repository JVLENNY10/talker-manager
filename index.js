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
