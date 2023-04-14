const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const talkerReader = require('./utils/talkerReader');
const generateToken = require('./utils/generateToken');
const loginValidation = require('./middleware/loginValidation');
const auth = require('./middleware/auth');
const validationName = require('./middleware/validationName');
const validationAge = require('./middleware/validationAge');
const validationTalk = require('./middleware/validationTalk');
const validationTalk2 = require('./middleware/validationTalk2');
const validationTask3 = require('./middleware/validationTask3');

const talkersPath = path.resolve(__dirname, './talker.json');

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = process.env.PORT || '3001';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', async (req, res) => {
  try {
    const talkers = await talkerReader();
    return res.status(200).json(talkers);
  } catch (error) {
    return res.status(200).json([]);
  }
});

app.get('/talker/:id', async (req, res) => {
  const id = Number(req.params.id);
  const talkers = await talkerReader();
  const talker = talkers.find((t) => t.id === id);
  if (!talker) {
 return res
      .status(404)
      .json({ message: 'Pessoa palestrante não encontrada' }); 
}
  return res.status(200).json(talker);
});

app.post('/login', loginValidation, async (req, res) => {
  const token = generateToken();
  return res.status(200).json({ token });
});

app.post('/talker', 
auth,
 validationName,
 validationAge, validationTalk, validationTalk2, validationTask3, async (req, res) => {
  try {
    const talker = await talkerReader();
    const { name, age, talk: { watchedAt, rate } } = req.body;
    const newTalker = {
      id: talker[talker.length - 1].id + 1,
      name,
      age,
      talk: {
        watchedAt,
        rate,
      },
    };
    const allTalkers = JSON.stringify([...talker, newTalker]);
    await fs.writeFile(talkersPath, allTalkers);
    res.status(201).json(newTalker);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`----------FULL POWER----------na porta ${PORT}`);
});
