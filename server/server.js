import express from 'express';
import { ObjectID } from 'mongodb';

import bodyParser from 'body-parser';

import { mongoose } from './db/mongoose'; // eslint-disable-line no-unused-vars
import { Todo } from './models/todo';
import { User } from './models/user'; // eslint-disable-line

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('<h1>Todo app</h1>');
});

app.post('/todos', (req, res) => {
  const todo = new Todo({
    text: req.body.text,
  });

  todo.save()
    .then(doc => res.send(doc))
    .catch(err => res.status(400).send(err));
});

app.get('/todos', (req, res) => {
  Todo.find()
    .then(todos => res.send({ todos }))
    .catch(err => res.status(400).send(err));
});

app.get('/todos/:id', (req, res) => {
  const { id } = req.params;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send('Invalid ID');
  }

  Todo.findById(id)
    .then(todo => (todo ? res.send({ todo }) : res.status(404).send('Todo not found')))
    .catch(() => res.status(400).send());
});

app.delete('/todos/:id', (req, res) => {
  const { id } = req.params;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send('Invalid ID');
  }

  Todo.findByIdAndRemove(id)
    .then(response => (response ? res.send('Todo removed successfully') : res.send(404).send('Todo not found')))
    .catch(() => res.status(400).send());
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => console.log(`Listen on port ${port}`));
}

export { app };
