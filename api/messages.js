const express = require('express');
const router = express.Router();
const queries = require('../queries.js');

router.post('/',(req,res,next)=>{
  req.body.adminId = req.user.id;
  queries.saveMessage(req.body).then((savedMessage)=>{
    delete savedMessage.adminId;
    savedMessage.admin = {
      id: req.user.id,
      firstName: req.user.firstName,
      lastName: req.user.lastName
    };
    sendMessages(savedMessage);
    res.send(savedMessage);
  });
});

module.exports = router;


function sendMessages(message){
  console.log(message);
}
