const express = require('express');
const router = express.Router();
const queries = require('../queries.js');

router.get('/',(req,res,next)=>{
  queries.getRequests(req.user.id).then((requests)=>{
    res.send(requests);
  });
});

router.post('/',(req,res,next)=>{
  queries.deleteRequest(req.body.organizationId, req.user.id).then(()=>{
    queries.createRequest(req.body.organizationId, req.user.id).then((request)=>{
      res.send(request);
    });
  });
});

router.patch('/',(req,res,next)=>{
  queries.deleteRequest(req.body.organizationId,req.body.requesterId).then(()=>{
    queries.joinOrganization(req.body.organizationId, req.body.requesterId).then((joined)=>{
      if(joined){
        res.send({success: 'requests accepted'});
      }else{
        res.send({error: 'There was an issue accepting user.'});
      }
    });
  });
});

router.delete('/',(req,res,next)=>{
  queries.deleteRequest(req.body.organizationId, req.body.requesterId).then((declinedRequest)=>{
    res.send(declinedRequest);
  });
});

module.exports = router;
