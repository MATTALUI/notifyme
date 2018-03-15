const knex = require('./knex.js');
module.exports = {
  checkEmailAvailability: (email)=>{
    return knex('users')
    .where('email', email)
    .first()
    .then(user => user === undefined ? true : false);
  },
  getHashword: (email)=>{
    return knex('users')
    .select('password')
    .where('email', email)
    .first()
    .then(relevantObject => relevantObject ? relevantObject.password : null);
  },
  getUserById: (id)=>{
    return knex('users')
    .where('id', id)
    .first()
    .then(user=>user);
  },
  getUserFromEmail: (email)=>{
    return knex('users')
    .where('email', email)
    .first()
    .then(user=>user?user:null);
  },
  createNewUser:(userInfo)=>{
    if(!userInfo.firstName || !userInfo.lastName || !userInfo.password || !userInfo.email){
      return false;
    }else{
      return knex('users')
      .insert(userInfo)
      .returning('*')
      .then(createdUser=>createdUser[0]);
    }
  },
  updateUser: (id,changes)=>{
    return knex('users')
    .where('id', id)
    .update(changes)
    .returning('*')
    // .first()
    .then(updatedUser=>updatedUser[0]);
  }




};
