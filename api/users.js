const express = require('express');
const router = express.Router();


router.use('*',(req,res,next)=>{
  res.send('this is the users router');
});

module.exports = router;
