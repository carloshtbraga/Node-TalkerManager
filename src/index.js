const express = require('express');
const talkerReader = require('./utils/talkerReader');

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = process.env.PORT || '3001';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', async (req,res) => {
try {
  const talkers = await talkerReader()
  return res.status(200).json(talkers);
} catch (error) {
  return res.status(200).json([])
}
})

app.listen(PORT, () => {
  console.log(`----------FULL POWER----------na porta ${PORT}`);
});
