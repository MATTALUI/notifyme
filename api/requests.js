const express = require('express');
const router = express.Router();
const queries = require('../queries.js');

router.get('/',(req,res,next)=>{
  queries.getRequests(req.user.id).then((requests)=>{
    res.send(requests);
  });
});

module.exports = router;
