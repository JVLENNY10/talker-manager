const checkDateValues = require('../helpers/checkDateValues');

const checkDate = (req, res, next) => {
  const { talk: { watchedAt } } = req.body;

  if (watchedAt === undefined) {
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

module.exports = checkDate;
