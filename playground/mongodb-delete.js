const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }

  console.log('Connected to MongoDB server');

  const db = client.db('TodoApp');

  // deleteMany

  // db.collection('Todos')
  //   .deleteMany({ text: 'Eat' })
  //   .then((result) => {
  //     console.log(result);
  //   });

  // deleteOne

  // db.collection('Todos')
  //   .deleteOne({ text: 'Eat' })
  //   .then(({ result }) => {
  //     console.log(result);
  //   });

  // findOneAndDelete

  // db.collection('Todos')
  //   .findOneAndDelete({ completed: false })
  //   .then((result) => {
  //     console.log(result);
  //   });

  // db.collection('Users')
  //   .deleteMany({ name: 'Patryk' })
  //   .then(result => {
  //     console.log(result);
  //   });

  db.collection('Users')
    .findOneAndDelete({ _id: new ObjectID('5aa9aff81b29514e56d8cba9') })
    .then((result) => {
      console.log(result);
    });

  client.close();
});
