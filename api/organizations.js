const express = require('express');
const router = express.Router();
const queries = require('../queries.js');

router.get('/',(req,res,next)=>{
  queries.getOrganizations(req.user.id).then((orgs)=>{
    res.send(orgs);
  });
});

router.get('/my-memberships', (req,res,next)=>{
  queries.getMyOrganizations(req.user.id).then((myOrgs)=>{
    res.send(myOrgs);
  });
});
router.get('/:orgId',(req,res,next)=>{
  queries.getOrganizationById(req.params.orgId, req.user.id).then((org)=>{
    res.send(org);
  });
});

router.get('/:orgId/admins',(req,res,next)=>{
  queries.getAdmins(req.params.orgId).then((admins)=>{
    res.send(admins);
  });
});

router.get('/:orgId/members', (req,res,next)=>{
  queries.getMembers(req.params.orgId).then((members)=>{
    res.send(members);
  });
});

router.get('/:orgId/messages', (req,res,next)=>{
  queries.getOrganizationsMessages(req.params.orgId).then((messages)=>{
    res.send(messages);
  });
});

router.post('/:orgId/admins', (req,res,next)=>{
  queries.addAdminByEmail(req.params.orgId, req.body.email).then((added)=>{
    if (!added){
      res.send({error: `Could not find user with email "${req.body.email}"`});
    }else{
      res.send(added);
    }
  });
});

router.post('/:orgId/members', (req,res,next)=>{
  queries.joinOrganization(req.params.orgId, req.user.id).then((joined)=>{
    res.send(joined);
  });
});

router.patch('/:orgId', (req,res,next)=>{
  queries.updateOrganization(req.params.orgId, req.body).then((updated)=>{
    res.send(updated);
  });
});

router.delete('/:orgId/members', (req,res,next)=>{
  let userId = req.user.id;
  queries.leaveOrganization(req.params.orgId, userId).then((left)=>{
    queries.removeAdmin(req.params.orgId, userId).then(()=>{
      queries.countOrganizationsAdmining(userId).then((count)=>{
        if (count === 0){
          queries.updateUser(userId, {admin: false});
        }
      });
    });
    res.send(left);
  });
});

router.post('/check-membership',(req,res,next)=>{
  queries.checkMembership(req.body.organizationId, req.user.id).then((member)=>{
    res.send(member);
  });
});
module.exports = router;
