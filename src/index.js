const express = require("express");
const talkerReader = require("./utils/talkerReader");
const generateToken = require("./utils/generateToken");

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = process.env.PORT || "3001";

// não remova esse endpoint, e para o avaliador funcionar
app.get("/", (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get("/talker", async (req, res) => {
  try {
    const talkers = await talkerReader();
    return res.status(200).json(talkers);
  } catch (error) {
    return res.status(200).json([]);
  }
});

app.get("/talker/:id", async (req, res) => {
  const id = Number(req.params.id);
  const talkers = await talkerReader();
  const talker = talkers.find((talker) => talker.id === id);
  if (!talker)
    return res
      .status(404)
      .json({ message: "Pessoa palestrante não encontrada" });
  return res.status(200).json(talker);
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const token = generateToken();
  return res.status(200).json({ token: token });
});

app.listen(PORT, () => {
  console.log(`----------FULL POWER----------na porta ${PORT}`);
});
