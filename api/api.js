const express = require('express');
const router = express.Router();

router.use('*', (req,res,next)=>{
  res.send('you used the api!');
});

module.exports = router;
