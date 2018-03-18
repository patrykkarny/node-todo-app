const { mongoose } = require('../server/db/mongoose'); // eslint-disable-line
const { Todo } = require('../server/models/todo');

Todo.findByIdAndRemove('5aaec306cbb92e8e066e4ae7')
  .then(res => console.log(res))
  .catch(e => console.log(e));
