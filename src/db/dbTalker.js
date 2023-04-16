const connection = require('./connections');

const select = () => connection.execute(
  'SELECT * FROM talkers',
);

module.exports = select;