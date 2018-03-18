import request from 'supertest';

import { app } from '../server';
import { Todo } from '../models/todo';

const todos = [{
  text: 'Test 1',
}, {
  text: 'Test 2',
}];

beforeEach((done) => {
  Todo.remove({})
    .then(() => Todo.insertMany(todos))
    .then(() => done());
});

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    const text = 'test';

    request(app)
      .post('/todos')
      .send({ text })
      .expect(200)
      .expect(res => expect(res.body.text).toBe(text))
      .end((err) => {
        if (err) return done(err);

        Todo.find({ text })
          .then((allTodos) => {
            expect(allTodos.length).toBe(1);
            expect(allTodos[0].text).toBe(text);
            done();
          })
          .catch(error => done(error));
      });
  });

  it('should not create todo with invalid data', (done) => {
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err) => {
        if (err) return done(err);

        Todo.find()
          .then((allTodos) => {
            expect(allTodos.length).toBe(2);
            done();
          })
          .catch(error => done(error));
      });
  });
});

describe('GET /todos', () => {
  it('should return all the todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect(res => expect(res.body.todos.length).toBe(2))
      .end(done);
  });
});
