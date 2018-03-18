const { mongoose } = require('../server/db/mongoose'); // eslint-disable-line
const { Todo } = require('../server/models/todo');
const { User } = require('../server/models/user');

const todoID = '5aac6653f04cbeaae329eec7';
const userID = '5aac4d1f2609cd7ce26c3ebf';

// Todo.find({ _id: todoID }).then(todos => console.log(todos));

// Todo.findOne({ _id: todoID }).then(todo => console.log(todo));

Todo.findById(todoID)
  .then(todo => (
    todo
      ? console.log(JSON.stringify(todo, null, 2))
      : console.log('Todo not found')
  ))
  .catch(error => console.log('Error: ', error));

User.findById(userID)
  .then(user => (
    user
      ? console.log(JSON.stringify(user, null, 2))
      : console.log('User not found')
  ))
  .catch(e => console.log(e));
