const fs = require('fs').promises;
const { Router } = require('express');

const checkAge = require('../middlewares/checkAge');
const checkDate = require('../middlewares/checkDate');
const checkName = require('../middlewares/checkName');
const checkRate = require('../middlewares/checkRate');
const checkTalk = require('../middlewares/checkTalk');
const checkToken = require('../middlewares/checkToken');

const route = Router();
const talkerJson = './talker.json';

route.get('/talker', (_req, res) => {
  fs.readFile(talkerJson, 'utf8').then((response) => res.status(200).json(JSON.parse(response)));
});

route.get('/talker/search', checkToken, (req, res) => {
  fs.readFile(talkerJson, 'utf8').then((response) => {
    const { q } = req.query;
    const talkers = JSON.parse(response);
    const checkSearchTerm = talkers.filter((talker) => talker.name.includes(q));

    return res.status(200).json(checkSearchTerm);
  });
});

route.get('/talker/:id', (req, res) => {
  fs.readFile(talkerJson, 'utf8').then((response) => {
    const { id } = req.params;
    const talkers = JSON.parse(response);
    const result = talkers.find((talker) => talker.id === parseInt(id, 10));

    if (!result) {
      return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
    }

    return res.status(200).json(result);
  });
});

route.post(
  '/talker',
  checkToken,
  checkName,
  checkAge,
  checkTalk,
  checkDate,
  checkRate,
  async (req, res) => {
    const { name, age, talk: { watchedAt, rate } } = req.body;
    const talkers = await fs.readFile(talkerJson, 'utf8').then((response) => JSON.parse(response));

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
  },
);

route.put(
  '/talker/:id',
  checkToken,
  checkName,
  checkAge,
  checkTalk,
  checkDate,
  checkRate,
  async (req, res) => {
    const { id } = req.params;
    const { name, age, talk: { watchedAt, rate } } = req.body;
    const talkers = await fs.readFile(talkerJson, 'utf8').then((response) => JSON.parse(response));

    const newTalker = { id: Number(id), name, age, talk: { watchedAt, rate } };
    talkers.splice(id - 1, 1, newTalker);

    await fs.writeFile(talkerJson, JSON.stringify(talkers));
    return res.status(200).json(newTalker);
  },
);

route.delete('/talker/:id', checkToken, async (req, res) => {
  const { id } = req.params;
  const talkers = await fs.readFile(talkerJson, 'utf8').then((response) => JSON.parse(response));

  talkers.splice(id - 1, 1);
  await fs.writeFile(talkerJson, JSON.stringify(talkers));

  return res.status(204).end();
});

module.exports = route;
