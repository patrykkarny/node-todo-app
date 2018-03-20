const { SHA256 } = require('crypto-js');
const { sign, verify } = require('jsonwebtoken');

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

