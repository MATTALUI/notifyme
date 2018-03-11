const knex = require('./knex.js');
module.exports = {
  getHashword: (email)=>{
    return knex('users')
    .select('password')
    .where('email', email)
    .first()
    .then(relevantObject => relevantObject ? relevantObject.password : null);
  },
  getUserFromEmail: (email)=>{
    return knex('users')
    .where('email', email)
    .first()
    .then(user=>user?user:null);
  }




};
