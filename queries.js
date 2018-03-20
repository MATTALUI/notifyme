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
          orgs.forEach((org, index)=>{ org.member = memberships[index]; });
          promises = [];
          orgs.forEach((org)=>{
            promises.push(module.exports.checkIfAdmin(org.id, userId));
          });
          return Promise.all(promises).then((adminships)=>{
            return orgs.map((org,index)=>{
              org.admin = adminships[index];
              return org;
            });
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
      let promises = [];
      orgs.forEach((org)=>{
        org.member=true;
        promises.push(module.exports.checkIfAdmin(org.id, userId));
      });
      return Promise.all(promises).then((adminships)=>{
        return orgs.map((org,index)=>{
          org.admin = adminships[index];
          return org;
        });
      });
    });
  },
  getOrganizationById: (orgId, userId=null)=>{
    return knex('organizations')
    .where('id', orgId)
    .first()
    .then((org)=>{
      if(userId){
        return module.exports.checkMembership(org.id, userId).then((member)=>{
          org.member = member;
          return module.exports.checkIfAdmin(org.id, userId).then((admin)=>{
            org.admin = admin;
            return org;
          });
        });
      }else{
        return org;
      }
    });
  },
  getOrganizationsMessages: (orgId)=>{
    return knex('messages')
    .where('organizationId', orgId)
    .orderBy('created_at', 'desc')
    .then((messages)=>{
      let promises = [];
      messages.forEach((message)=>{
        promises.push(module.exports.getUserById(message.adminId));
      });
      return Promise.all(promises).then((admins)=>{
        messages.forEach((message, index)=>{
          let currentAdmin = admins[index];
          message.admin = {
            id: currentAdmin.id,
            firstName: currentAdmin.firstName,
            lastName: currentAdmin.lastName
          };
          delete message.adminId;
        });
        return messages;
      });
    });
  },
  checkMembership: (orgId, userId)=>{
    return knex('users_organizations')
    .where('organizationId', orgId)
    .where('userId', userId)
    .then(membership => (membership.length > 0));
  },
  checkIfAdmin: (orgId, userId)=>{
    return knex('admins_organizations')
    .where('organizationId', orgId)
    .where('adminId', userId)
    .then(adminship => (adminship.length > 0));
  },
  getMembers: (orgId)=>{
    return knex('users_organizations')
    .where('organizationId', orgId)
    .join('users', 'users_organizations.userId', 'users.id')
    .select('users.*')
    .then((members)=>{
      members.forEach((member)=>{
        delete member.password;
      });
      return members;
    });
  },
  getAdmins: (orgId)=>{
    return knex('admins_organizations')
    .where('organizationId', orgId)
    .join('users', 'admins_organizations.adminId', 'users.id')
    .select('users.*')
    .then((members)=>{
      members.forEach((member)=>{
        delete member.password;
      });
      return members;
    });
  },
  joinOrganization: (organizationId, userId)=>{
    return knex('users_organizations')
    .insert({organizationId, userId})
    .returning('*')
    .then(joined=>joined?true:false);
  },
  leaveOrganization: (orgId, userId)=>{
    return knex('users_organizations')
    .del()
    .where('organizationId', orgId)
    .where('userId', userId)
    .returning('*')
    .then(deleted=>deleted.length?true:false)
  },




};
