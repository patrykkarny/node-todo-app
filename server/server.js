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

app.post('/todos', authenticate, async (req, res) => {
  const todo = new Todo({
    text: req.body.text,
    _creator: req.user._id,
  });

  try {
    const savedTodo = await todo.save();
    res.send(savedTodo);
  } catch (err) {
    res.status(400).send(err)
  }
});

app.get('/todos', authenticate, async (req, res) => {
  try {
    const todos = await Todo.find({ _creator: req.user._id });
    res.send({ todos })
  } catch (err) {
    res.status(400).send(err)
  }
});

app.get('/todos/:id', authenticate, async (req, res) => {
  const { id } = req.params;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send('Invalid ID');
  }

  try {
    const todo = await Todo.findOne({ _id: id, _creator: req.user._id });

    return todo ? res.send({ todo }) : res.status(404).send('Todo not found');
  } catch (err) {
    res.status(400).send();
  }
});

app.delete('/todos/:id', authenticate, async (req, res) => {
  const { id } = req.params;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send('Invalid ID');
  }

  try {
    const todo = await Todo.findOneAndRemove({ _id: id, _creator: req.user._id });

    return todo ? res.send({ todo }) : res.send(404).send('Todo not found');
  } catch (e) {
    res.status(400).send();
  }
});

app.patch('/todos/:id', authenticate, async (req, res) => {
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

  try {
    const todo = await Todo.findOneAndUpdate(
      { _id: id, _creator: req.user._id },
      { $set: body },
      { new: true },
    );

    return todo ? res.send({ todo }) : res.status(404).send('Todo not found');
  } catch (err) {
    res.status(400).send();
  }
});

app.post('/users', async (req, res) => {
  try {
    const body = pick(req.body, ['email', 'password']);
    const user = new User(body);
    await user.save();
    const token = await user.generateAuthToken();
    res.header('x-auth', token).send(user);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

app.post('/users/login', async (req, res) => {
  try {
    const credentials = pick(req.body, ['email', 'password']);
    const user = await User.findByCredentials(credentials);
    const token = await user.generateAuthToken();
    res.header('x-auth', token).send(user);
  } catch (err) {
    res.status(401).send(err);
  }
});

app.delete('/users/me/token', authenticate, async (req, res) => {
  try {
    await req.user.removeToken(req.token);
    res.send();
  } catch (e) {
    res.status(400).send();
  }
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => console.log(`Listen on port ${port}`));
}

export { app };
