import express from 'express';
import { ObjectID } from 'mongodb';
import bodyParser from 'body-parser';

import pick from 'lodash/pick';
import isBoolean from 'lodash/isBoolean';

import { Todo } from './models/todo';
import { User } from './models/user';
import { authenticate } from './middleware/authenticate';

import './config/config';
import './db/mongoose';

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('<h1>Todo app</h1>');
});

app.post('/todos', authenticate, (req, res) => {
  const todo = new Todo({
    text: req.body.text,
    _creator: req.user._id,
  });

  todo.save()
    .then(doc => res.send(doc))
    .catch(err => res.status(400).send(err));
});

app.get('/todos', authenticate, (req, res) => {
  Todo.find({ _creator: req.user._id })
    .then(todos => res.send({ todos }))
    .catch(err => res.status(400).send(err));
});

app.get('/todos/:id', authenticate, (req, res) => {
  const { id } = req.params;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send('Invalid ID');
  }

  Todo.findOne({ _id: id, _creator: req.user._id })
    .then(todo => (todo ? res.send({ todo }) : res.status(404).send('Todo not found')))
    .catch(() => res.status(400).send());
});

app.delete('/todos/:id', authenticate, (req, res) => {
  const { id } = req.params;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send('Invalid ID');
  }

  Todo.findOneAndRemove({ _id: id, _creator: req.user._id })
    .then(todo => (todo ? res.send({ todo }) : res.send(404).send('Todo not found')))
    .catch(() => res.status(400).send());
});

app.patch('/todos/:id', authenticate, (req, res) => {
  const { id } = req.params;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send('Invalid ID');
  }

  const { text, completed } = pick(req.body, ['text', 'completed']);
  const isCompleted = isBoolean(completed) && completed;

  const body = {
    text,
    completed: isCompleted,
    completedAt: isCompleted ? new Date().getTime() : null,
  };

  Todo.findOneAndUpdate({ _id: id, _creator: req.user._id }, { $set: body }, { new: true })
    .then(todo => (todo ? res.send({ todo }) : res.status(404).send('Todo not found')))
    .catch(() => res.status(400).send());
});

app.post('/users', (req, res) => {
  const body = pick(req.body, ['email', 'password']);
  const user = new User(body);

  user.save()
    .then(() => user.generateAuthToken())
    .then(token => res.header('x-auth', token).send(user))
    .catch(error => res.status(400).send(error));
});

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

app.post('/users/login', (req, res) => {
  const credentials = pick(req.body, ['email', 'password']);

  User.findByCredentials(credentials)
    .then(user => user.generateAuthToken().then(token => res.header('x-auth', token).send(user)))
    .catch(err => res.status(401).send(err));
});

app.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token)
    .then(() => res.send())
    .catch(() => res.status(400).send());
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => console.log(`Listen on port ${port}`));
}

export { app };
