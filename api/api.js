const express = require('express');
const users = require('./users.js');
const organizations = require('./organizations.js');
const router = express.Router();

router.get('/test', (req,res,next)=>{
  res.send({hello: 'world'});
});
router.use('/organizations', organizations);
router.use('*', (req,res,next)=>{
  console.log(req.body);
  res.send('you used the api!');
});

module.exports = router;
