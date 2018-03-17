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

router.post('/:orgId/join', (req,res,next)=>{
  queries.joinOrganization(req.params.orgId, req.user.id).then((joined)=>{
    res.send(joined);
  });
});
router.delete('/:orgId/join', (req,res,next)=>{
  queries.leaveOrganization(req.params.orgId, req.user.id).then((left)=>{
    res.send(left);
  });
});

router.post('/check-membership',(req,res,next)=>{
  queries.checkMembership(req.body.organizationId, req.user.id).then((member)=>{
    res.send(member);
  });
});
module.exports = router;
