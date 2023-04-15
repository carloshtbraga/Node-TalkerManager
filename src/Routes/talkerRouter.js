const express = require('express');
const validationName = require('../middleware/validationName');
const validationAge = require('../middleware/validationAge');
const validationTalk = require('../middleware/validationTalk');
const validationTalk2 = require('../middleware/validationTalk2');
const validationTask3 = require('../middleware/validationTask3');
const talkerReader = require('../utils/talkerReader');

const auth = require('../middleware/auth');
const talkerWriter = require('../utils/talkerWriter');

const router = express.Router();
router.use(express.json());

router.get('/talker', async (req, res) => {
    try {
      const talkers = await talkerReader();
      return res.status(200).json(talkers);
    } catch (error) {
      return res.status(200).json([]);
    }
  });
  
  router.get('/talker/:id', async (req, res) => {
    const id = Number(req.params.id);
    const talkers = await talkerReader();
    const talker = talkers.find((t) => t.id === id);
    if (!talker) {
   return res.status(404).json({ message: 'Pessoa palestrante não encontrada' }); 
  } return res.status(200).json(talker);
  });
  
  router.post('/talker', 
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
      const allTalkers = [...talker, newTalker];
      await talkerWriter(allTalkers);
      res.status(201).json(newTalker);
    } catch (err) {
 res.status(500).send({ message: err.message });
    }
  });

  router.delete('/talker/:id', auth, async (req, res) => {
    const id = Number(req.params.id);
    const talkers = await talkerReader();
    const talker = talkers.filter((t) => t.id !== id);
    await talkerWriter(talker);
    return res.sendStatus(204);
  });

module.exports = router;