const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }

  console.log('Connected to MongoDB server');

  const db = client.db('TodoApp');

  // findOneAndUpdate

  // db.collection('Todos')
  //   .findOneAndUpdate(
  //     {
  //       _id: new ObjectID('5aa9b63ddd40c88f7d03b91f'),
  //     },
  //     {
  //       $set: {
  //         completed: true,
  //       },
  //     },
  //     {
  //       returnOriginal: false,
  //     },
  //   )
  //   .then((result) => {
  //     console.log(result);
  //   });

  db.collection('Users')
    .findOneAndUpdate(
      {
        _id: new ObjectID('5aa9a4bb8c988d4cb0db34da'),
      },
      {
        $set: {
          name: 'Patryk',
        },
        $inc: {
          age: 1,
        },
      },
      {
        returnOriginal: false,
      },
    )
    .then((result) => {
      console.log(result);
    });

  client.close();
});
