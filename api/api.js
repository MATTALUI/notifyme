const express = require('express');
const users = require('./users.js');
const router = express.Router();

router.get('/test', (req,res,next)=>{
  res.send({hello: 'world'});
});
// router.use('/users', users);
router.use('*', (req,res,next)=>{
  console.log(req.body);
  res.send('you used the api!');
});

module.exports = router;
