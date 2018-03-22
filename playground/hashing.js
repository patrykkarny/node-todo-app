const { SHA256 } = require('crypto-js');
const { sign, verify } = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const pass = '123abc';

// bcrypt.genSalt(10, (err, salt) => {
//   bcrypt.hash(pass, salt, (e, hash) => {
//     console.log(hash);
//   });
// });

const hashedPassword = '$2a$10$ON51.FdbSTkw29dXWEtk.eXAyldJJviLMo36O1WLM30V83rXb3tda';

bcrypt.compare(pass, hashedPassword, (e, res) => {
  console.log(res);
});

// const message = 'I am user';

// const hash = SHA256(message).toString();

// console.log(hash);

// const data = {
//   id: 4,
// };

// const token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + 'somesecret ').toString(),
// };

// console.log(token.hash);

const data = {
  id: 5,
};

const token = sign(data, '123qwe');
const decoded = verify(token, '123qwe');

console.log(token);
console.log(decoded);

