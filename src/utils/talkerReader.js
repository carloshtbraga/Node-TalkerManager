const fs = require('fs').promises;
const path = require('path');

const talkersPath = path.resolve(__dirname, '../talker.json');

const talkerReader = async () => {
  try {
    const data = await fs.readFile(talkersPath);
    console.log(data);
    return JSON.parse(data);
  } catch (error) {
    console.error(`Arquivo não pôde ser lido/encontrado: ${error}`);
  }
};

module.exports = talkerReader;
