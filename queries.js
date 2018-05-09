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
  updateUser: (userId,changes)=>{
    return knex('users')
    .where('id', userId)
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
            promises.push(module.exports.checkIfOrganizationAdmin(org.id, userId));
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
        promises.push(module.exports.checkIfOrganizationAdmin(org.id, userId));
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
          return module.exports.checkIfOrganizationAdmin(org.id, userId).then((admin)=>{
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
  checkIfOrganizationAdmin: (orgId, userId)=>{
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
    .then(deleted=>deleted.length?true:false);
  },
  updateOrganization: (orgId, changes)=>{
    return knex('organizations')
    .where('id', orgId)
    .update(changes)
    .returning('*')
    .then(updatedOrganization=>updatedOrganization[0]);
  },

  //admin queries
  toggleAdmin: (userId)=>{
    return module.exports.checkIfAdmin(userId)
    .then((admin)=>{
      return knex('users')
      .update('admin', !admin)
      .returning('*')
      .then(updatedUser=>updatedUser[0]);
    });
  },
  checkIfAdmin: (userId)=>{
    return knex('users')
    .where('id', userId)
    .first()
    .then(user => user.admin );
  },
  countOrganizationsAdmining: (userId)=>{
    return knex('admins_organizations')
    .where('adminId', userId)
    .then(organizations=>organizations.length);
  },
  addAdminById: (orgId, userId)=>{
    return knex('admins_organizations')
    .insert({
      adminId: userId,
      organizationId: orgId
    })
    .returning('*')
    .then(created=>created);
  },
  addAdminByEmail: (orgId, email)=>{
    return module.exports.getUserFromEmail(email).then((user)=>{
      if(!user){
        return false;
      }else{
        return knex('admins_organizations')
        .insert({
          adminId: user.id,
          organizationId: orgId
        })
        .returning('*')
        .then(added=>added ? true : false);
      }
    });
  },
  removeAdmin: (orgId, userId)=>{
    return knex('admins_organizations')
    .del()
    .where('organizationId', orgId)
    .where('adminId', userId)
    .returning('*')
    .then(deleted=>deleted);
  },

  //messages queries
  getMyMessages: (userId)=>{
    return knex('users_organizations')
    .where('userId', userId)
    .select([
      'messages.id as messageId',
      'messages.*',
      'organizations.description',
      'organizations.title',
      'organizations.public',
      'organizations.visible',
      'users.firstName',
      'users.lastName'
    ])
    .join('messages', 'users_organizations.organizationId', 'messages.organizationId')
    .join('organizations', 'messages.organizationId', 'organizations.id')
    .join('users', 'messages.adminId', 'users.id')
    .returning('*')
    .orderBy('messages.created_at', 'desc')
    .limit(20)
    .then((myMessages)=>{
      return myMessages.map((message)=>{
        let organization = {};
        let admin = {};

        organization.id = message.organizationId;
        organization.description = message.description;
        organization.title = message.title;
        organization.public = message.public;
        organization.visible = message.visible;
        delete message.public;
        delete message.visible;
        delete message.title;
        delete message.description;
        delete message.organizationId;
        delete message.userId;

        admin.id = message.adminId;
        admin.firstName = message.firstName;
        admin.lastName = message.lastName;
        delete message.adminId;
        delete message.firstName;
        delete message.lastName;

        message.id = message.messageId;
        delete message.messageId;

        message.organization = organization;
        message.admin = admin;
        return message;
      });
    });

  },
  saveMessage: (message)=>{
    return knex('messages')
    .insert(message)
    .returning('*')
    .then(savedMessage=>savedMessage[0]);
  },

  //requests queries
  getRequests: (userId)=>{
    return knex('requests')
    .select([
      'users.firstName',
      'users.lastName',
      'organizations.title',
      'requests.*'
    ])
    .join('users', 'requesterId', 'users.id')
    .join('organizations', 'organizationId', 'organizations.id')
    .returning('*')
    .then((requests)=>{
      return requests.map((request)=>{
        let user = {};
        let organization = {};
        user.id = request.requesterId;
        user.firstName = request.firstName;
        user.lastName = request.lastName;
        delete request.requesterId;
        delete request.firstName;
        delete request.lastName;

        organization.id = request.organizationId;
        organization.title = request.title;
        delete request.organizationId;
        delete request.title;

        request.user = user;
        request.organization = organization;
        return request;
      });
    });
  },
  declineRequest:(orgId,userId)=>{
    return knex('requests')
    .del()
    .where('organizationId', orgId)
    .where('requesterId', userId)
    .returning('*')
    .then(deleted=>deleted);
  }
};
