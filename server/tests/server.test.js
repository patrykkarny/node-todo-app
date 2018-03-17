const request = require('supertest');

const { app } = require('../server');
const { Todo } = require('../models/todo');

const todos = [{
  text: 'Test 1',
}, {
  text: 'Test 2'
}];

console.log(process.env.NODE_ENV)

beforeEach((done) => {
  Todo.remove({})
    .then(() => Todo.insertMany(todos))
    .then(() => done())
});

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    const text = 'test';

    request(app)
      .post('/todos')
      .send({ text })
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo
          .find({ text })
          .then((todos) => {
            expect(todos.length).toBe(1);
            expect(todos[0].text).toBe(text);
            done();
          })
          .catch((err) => {
            done(err);
          });
      })
  });

  it('should not create todo with invalid data', (done) => {
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);

        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch(err => done(err));
      })
  });
});

describe('GET /todos', () => {
  it('should return all the todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect(res => expect(res.body.todos.length).toBe(2))
      .end(done)
  });
});
