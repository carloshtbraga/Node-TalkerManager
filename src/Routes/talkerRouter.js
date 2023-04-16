const express = require('express');
const validationName = require('../middleware/validationName');
const validationAge = require('../middleware/validationAge');
const validationTalk = require('../middleware/validationTalk');
const validationTalk2 = require('../middleware/validationTalk2');
const validationTask3 = require('../middleware/validationTask3');
const talkerReader = require('../utils/talkerReader');
const workedObj = require('../utils/workedObj');

const auth = require('../middleware/auth');
const talkerWriter = require('../utils/talkerWriter');
const validation11 = require('../middleware/validation11');
const validationRate = require('../middleware/validationRate');
const validationWatchedAt = require('../middleware/validationWatchedAt');
const select = require('../db/dbTalker');

const router = express.Router();

router.get('/talker', async (req, res) => {
    try {
      const talkers = await talkerReader();
      return res.status(200).json(talkers);
    } catch (error) {
      return res.status(200).json([]);
    }
  });

  router.get('/talker/search', auth, validationRate, validationWatchedAt, async (req, res) => {
    const { rate, q, date } = req.query;
    const talkers = await talkerReader();
    let filteredTalkers = talkers;
    if (q) { 
       filteredTalkers = talkers.filter((t) => t.name.includes(q));      
    }
    if (rate) {
      filteredTalkers = filteredTalkers.filter((t) => t.talk.rate === Number(rate));
    }
    if (date) {
      filteredTalkers = filteredTalkers.filter((t) => t.talk.watchedAt === date);
    }
    
    return res.status(200).json(filteredTalkers);
  });

  router.get('/talker/db', async (req, res) => {
      const [data] = await select();
      const organizedData = data.map((dt) => workedObj(dt));
      res.status(200).json(organizedData);
  });

  router.patch('/talker/rate/:id', 
  auth,
    validation11, async (req, res) => {
      const talkers = await talkerReader();
      const id = Number(req.params.id);
      const rate = Number(req.body.rate);
      const index = talkers.findIndex((d) => d.id === id);
      talkers[index].talk.rate = rate;
      await talkerWriter(talkers);
      return res.sendStatus(204);
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

  router.put('/talker/:id', 
  auth,
   validationName,
    validationAge, validationTalk, validationTalk2, validationTask3, async (req, res) => {
      const id = Number(req.params.id);
      const { name, age, talk } = req.body;
      const talker = await talkerReader();
      const index = talker.findIndex((d) => d.id === id);
      if (!talker[index]) {
 return res.status(404).json({ message: 'Pessoa palestrante não encontrada' }); 
}
      talker[index] = { id, name, age, talk };
      await talkerWriter(talker);
      res.status(200).json(talker[index]);
  });

  router.delete('/talker/:id', auth, async (req, res) => {
    const id = Number(req.params.id);
    const talkers = await talkerReader();
    const talker = talkers.filter((t) => t.id !== id);
    await talkerWriter(talker);
    return res.sendStatus(204);
  });

module.exports = router;