const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;

const app = express();
app.use(bodyParser.json());

const talkerJson = './talker.json';
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
  fs.readFile(talkerJson, 'utf8')
    .then((response) => res.status(200).json(JSON.parse(response)));
});

const checkToken = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ message: 'Token não encontrado' });
  } if (authorization.length !== 16) {
    return res.status(401).json({ message: 'Token inválido' });
  }

  next();
};

// Requisito 7
app.get('/talker/search', checkToken, async (req, res) => {
  await fs.readFile(talkerJson, 'utf8')
    .then((response) => {
      const { q } = req.query;
      const talkers = JSON.parse(response);
      const checkSearchTerm = talkers.filter((talker) => talker.name.includes(q));

      // if (!q || q === '') return res.status(200).json(talkers);
      // if (!checkSearchTerm) return res.status(200).json([]);

      return res.status(200).json(checkSearchTerm);
    });
});

// Requisito 2
app.get('/talker/:id', (req, res) => {
  fs.readFile(talkerJson, 'utf8')
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

// Requisito 4

// Eduardo Miyazaki (T16-A) me lembrou do JSON.stringify para passar o array para string antes de reescrever o arquivo talker.json

const checkName = (req, res, next) => {
  const { name } = req.body;

  if (!name || name === '') {
    return res.status(400).json({ message: 'O campo "name" é obrigatório' });
  } if (name.length < 3) {
    return res.status(400).json({ message: 'O "name" deve ter pelo menos 3 caracteres' });
  }

  next();
};

const checkAge = (req, res, next) => {
  const { age } = req.body;

  if (!age || age === '') {
    return res.status(400).json({ message: 'O campo "age" é obrigatório' });
  } if (age < 18) {
    return res.status(400).json({ message: 'A pessoa palestrante deve ser maior de idade' });
  }

  next();
};

const checkDateValues = (dateValues) => (
  dateValues.every((date, index) => {
    if (index < 2 && date.length === 2) return true;
    if (date.length === 4) return true;
    return false;
  })
);

const checkDate = (req, res, next) => {
  const { talk: { watchedAt } } = req.body;

  if (!watchedAt || watchedAt === '') {
    return res.status(400).json({
      message: 'O campo "talk" é obrigatório e "watchedAt" e "rate" não podem ser vazios',
    });
  }

  const dateValues = watchedAt.split('/');
  const dateBarsLength = watchedAt.split('/').length - 1;

  if (dateBarsLength !== 2 || !checkDateValues(dateValues)) {
    return res.status(400).json({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
  }

  next();
};

const checkRate = (req, res, next) => {
  const { talk: { rate } } = req.body;

  if (rate <= 0 || rate >= 6) {
    return res.status(400).json({ message: 'O campo "rate" deve ser um inteiro de 1 à 5' });
  } if (!rate || rate === '') {
    return res.status(400).json({
      message: 'O campo "talk" é obrigatório e "watchedAt" e "rate" não podem ser vazios',
    });
  }

  next();
};

const checkTalk = (req, res, next) => {
  const { talk } = req.body;

  if (!talk || talk === '') {
    return res.status(400).json({
      message: 'O campo "talk" é obrigatório e "watchedAt" e "rate" não podem ser vazios',
    });
  }

  next();
};

app.post('/talker',
  checkToken,
  checkName,
  checkAge,
  checkTalk,
  checkDate,
  checkRate,
  async (req, res) => {
    const { name, age, talk: { watchedAt, rate } } = req.body;
    const talkers = await fs.readFile(talkerJson, 'utf8')
      .then((response) => JSON.parse(response));

    const newTalker = {
      id: talkers.length + 1,
      name,
      age,
      talk: {
        watchedAt,
        rate,
      },
    };

    talkers.push(newTalker);
    await fs.writeFile(talkerJson, JSON.stringify(talkers));
    return res.status(201).json(newTalker);
  });

// Requisito 5
app.put('/talker/:id',
  checkToken,
  checkName,
  checkAge,
  checkTalk,
  checkDate,
  checkRate,
  async (req, res) => {
    const { id } = req.params;
    const { name, age, talk: { watchedAt, rate } } = req.body;
    const talkers = await fs.readFile(talkerJson, 'utf8')
      .then((response) => JSON.parse(response));

    const newTalker = { id: Number(id), name, age, talk: { watchedAt, rate } };
    talkers.splice(id - 1, 1, newTalker);

    await fs.writeFile(talkerJson, JSON.stringify(talkers));
    return res.status(200).json(newTalker);
  });

// Requisito 6
app.delete('/talker/:id', checkToken, async (req, res) => {
  const { id } = req.params;
  const talkers = await fs.readFile(talkerJson, 'utf8')
    .then((response) => JSON.parse(response));

  talkers.splice(id - 1, 1);
  await fs.writeFile(talkerJson, JSON.stringify(talkers));
  return res.status(204).end();
});
