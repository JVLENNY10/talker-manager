const express = require('express');
const bodyParser = require('body-parser');

const loginRoutes = require('./routes/loginRoutes');
const talkerRoutes = require('./routes/talkerRoutes');

const app = express();
app.use(bodyParser.json());

const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_req, res) => res.status(200).send());

app.use(talkerRoutes);
app.use(loginRoutes);

app.listen(PORT, () => console.log('Online'));
