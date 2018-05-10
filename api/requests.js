const express = require('express');
const router = express.Router();
const queries = require('../queries.js');

router.get('/',(req,res,next)=>{
  queries.getRequests(req.user.id).then((requests)=>{
    res.send(requests);
  });
});

router.post('/',(req,res,next)=>{
  //make new requests
  queries.declineRequest(req.body.organizationId, req.user.id).then(()=>{
    queries.makeRequest(req.body.organizationId, req.user.id).then((request)=>{
      res.send(request);
    });
  });
});

router.patch('/',(req,res,next)=>{
  //accept Requests
  res.send({success: 'requests accepted'});
});

router.delete('/',(req,res,next)=>{
  queries.declineRequest(req.body.organizationId, req.body.requesterId).then((declinedRequest)=>{
    res.send(declinedRequest);
  });
});

module.exports = router;
