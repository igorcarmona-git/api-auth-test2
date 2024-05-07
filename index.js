const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const User = require('./models/User');
const port = 3000;
const db = require('./db');
app.use(express.json());

const {hashPassword} = require('./middlewares/hashPassword');
const { generateToken } = require('./middlewares/authService');

db.sync();

app.get('/', (req, res) => {
  return res.status(200).send('Hello World!');
});

app.post('/register', hashPassword, async (req, res) => {
  const user = await User.create(
    {...req.body}
  );
  
  return res.status(201).send(user);
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email }});

  if (!user) {
    return res.status(401).send({error: 'invalid email or password'});
  }

  const validPassword = await bcrypt.compare(password, user.password);
  // função bcrypt.compare é usada para comparar uma senha fornecida com um hash previamente gerado e armazenado. Neste caso, password é a senha que o usuário forneceu e user.password é o hash da senha armazenada no banco de dados para o usuário específico.

  if (!validPassword) {
    return res.status(401).send({ error: 'invalid email or password' });
  }

  const token = generateToken(user.dataValues);
  delete user.dataValues.password;
  return res.status(200).send({ msg: 'login success', user, token });
});

app.listen(port, () => {
  console.log(`app on http://localhost:${port}`);
});
