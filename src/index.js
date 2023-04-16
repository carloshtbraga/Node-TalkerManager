const express = require('express');

const talkerRouter = require('./Routes/talkerRouter');
const loginRouter = require('./Routes/loginRouter');

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = process.env.PORT || '3001';

app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.use(talkerRouter);
app.use(loginRouter);

app.listen(PORT, () => {
  console.log(`----------'FULL POWER----------${PORT}`);
});
