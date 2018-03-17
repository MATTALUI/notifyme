const knex = require('./knex.js');
module.exports = {
  //user queries
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
    .then(updatedUser=>updatedUser[0]);
  },


  //organizations queries
  getOrganizations: (userId)=>{
    return knex('organizations')
    .select('*')
    .then((orgs)=>{
      if (userId === undefined){
        return orgs;
      }else{
        let promises = [];
        orgs.forEach((org)=>{
          promises.push(module.exports.checkMembership(org.id, userId));
        });
        return Promise.all(promises).then((memberships)=>{
          return orgs.map((org, index)=>{
            org.member = memberships[index];
            return org;
          });
        });
      }
    });
  },
  getMyOrganizations: (userId)=>{
    return knex('users_organizations')
    .where('users_organizations.userId', userId)
    .join('organizations', 'organizations.id', 'users_organizations.organizationId')
    .select('organizations.*')
    .then((orgs)=>{
      orgs.forEach((org)=>{org.member=true;});
      return orgs;
    });
  },
  checkMembership: (orgId, userId)=>{
    return knex('users_organizations')
    .where('organizationId', orgId)
    .where('userId', userId)
    .then(membership=>membership.length > 0 ? true : false);
  }




};
