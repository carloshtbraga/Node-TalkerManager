const fs = require('fs/promises');

const path = require('path');

const talkersPath = path.resolve(__dirname, '../talker.json');

const talkerWriter = async (data) => {
  const jsonData = JSON.stringify(data);
  console.log('Escrito com sucesso');
  await fs.writeFile(talkersPath, jsonData);
};

module.exports = talkerWriter;
