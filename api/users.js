const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const queries = require('../queries.js');
const router = express.Router();



router.post('/', (req,res,next)=>{
  console.log(req.body);
  res.send('tudo bom');
});

router.get('/me', (req,res,next)=>{
  if(req.cookies.user){
    jwt.verify(req.cookies.user, process.env.JWT_SECRET, (err, user)=>{
      if(user===undefined){
        res.send(null);
      }else{
        res.send(user);
      }
    });
  }else{
    res.send(null);
  }
});

router.post('/login',(req,res,next)=>{
  queries.getUserFromEmail(req.body.email).then((user)=>{
    if (user === null){
      return res.send({error: 'invalid credentials'});
    }else{
      bcrypt.compare(req.body.password, user.password, (err, match)=>{
        if (match){
          delete user.password;
          let clone = Object.assign({},user);
          jwt.sign(clone, process.env.JWT_SECRET, (err, token)=>{
            res.cookie('user', token, {httpOnly: true});
            res.send({success: 'sucessfully logged in'});
          });
        }else{
          return res.send({error: 'invalid credentials'});
        }
      });
    }
  });
});

router.delete('/logout',(req,res,next)=>{
  res.clearCookie('user');
  res.send(true);
});

// router.use('*',(req,res,next)=>{
//
//   // res.send('this is the users router');
// });

module.exports = router;
