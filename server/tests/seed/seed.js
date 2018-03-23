import { ObjectID } from 'mongodb';
import { sign } from 'jsonwebtoken';
import { Todo } from '../../models/todo';
import { User } from '../../models/user';

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

export const users = [{
  _id: userOneId,
  email: 'patryk@example.com',
  password: 'samplePass!',
  tokens: [{
    access: 'auth',
    token: sign({ _id: userOneId, access: 'auth' }, 'abc123').toString(),
  }],
}, {
  _id: userTwoId,
  email: 'kamil@example.com',
  password: 'SimplePass11!',
  tokens: [{
    access: 'auth',
    token: sign({ _id: userTwoId, access: 'auth' }, 'abc123').toString(),
  }],
}];

export const todos = [{
  _id: new ObjectID(),
  text: 'Test 1',
  _creator: userOneId,
}, {
  _id: new ObjectID(),
  text: 'Test 2',
  completed: true,
  completedAt: 123,
  _creator: userTwoId,
}];

export const populateTodos = (done) => {
  Todo.remove({})
    .then(() => Todo.insertMany(todos))
    .then(() => done());
};

export const populateUsers = (done) => {
  User.remove({})
    .then(() => {
      const userOne = new User(users[0]).save();
      const userTwo = new User(users[1]).save();

      return Promise.all([userOne, userTwo]);
    })
    .then(() => done());
};
