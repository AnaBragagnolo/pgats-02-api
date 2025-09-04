const bcrypt = require('bcryptjs');

// In-memory user database
const users = [
  {
    username: 'julio', 
    password: bcrypt.hashSync('123456', 8), 
    favorecidos: [ 'priscila' ], 
    saldo: 100
  },
  {
    username: 'priscila', 
    password: bcrypt.hashSync('123456', 8), 
    favorecidos: [ 'julio' ], 
    saldo: 100
  }
];

module.exports = {
  users
};
