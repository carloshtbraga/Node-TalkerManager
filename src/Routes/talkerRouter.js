const express = require('express');
const validationName = require('../middleware/validationName');
const validationAge = require('../middleware/validationAge');
const validationTalk = require('../middleware/validationTalk');
const validationTalk2 = require('../middleware/validationTalk2');
const validationTask3 = require('../middleware/validationTask3');
const talkerReader = require('../utils/talkerReader');

const auth = require('../middleware/auth');
const talkerWriter = require('../utils/talkerWriter');
const validation11 = require('../middleware/validation11');

const router = express.Router();

router.get('/talker', async (req, res) => {
    try {
      const talkers = await talkerReader();
      return res.status(200).json(talkers);
    } catch (error) {
      return res.status(200).json([]);
    }
  });

  router.get('/talker/search', auth, async (req, res) => {
    const rateParam = Number(req.query.rate);
    const searchTerm = req.query.q;
    const talkers = await talkerReader();
    
    let filteredTalkers = talkers;
  
    if (searchTerm) {
      filteredTalkers = filteredTalkers.filter((t) => t.name.includes(searchTerm));
    }
  
    if (!Number.isInteger(rateParam) || rateParam < 1 || rateParam > 5) {
      return res.status(400).json({
        message: 'O campo "rate" deve ser um número inteiro entre 1 e 5',
      }); 
    }
      filteredTalkers = filteredTalkers.filter((t) => t.talk.rate === rateParam);
    if (req.query.hasOwnProperty('rate')) { await talkerWriter(filteredTalkers); }
    return res.status(200).json(filteredTalkers);
  });
  
  router.get('/talker/search', auth, async (req, res) => {
    const searchTerm = req.query.q;
    const talkers = await talkerReader();
    if (!searchTerm) return res.status(200).json(talkers);
    const talker = talkers.filter((t) => t.name.includes(searchTerm));
    await talkerWriter(talker);
    return res.status(200).json(talker);
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