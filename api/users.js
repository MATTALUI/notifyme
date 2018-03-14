const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const queries = require('../queries.js');
const router = express.Router();




router.post('/', (req,res,next)=>{
  if (req.cookies.user){
    res.clearCookie('user');
  }
  unifyNewUser(req.body);
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(req.body.password, salt, function(err, hash) {
        req.body.password = hash;
        queries.createNewUser(req.body).then((createdUser)=>{
          if(createdUser){
            delete createdUser.password;
            let clone = Object.assign({},createdUser);
            jwt.sign(clone, process.env.JWT_SECRET,(err,token)=>{
              res.cookie('user', token, {httpOnly: true});
              res.send({success: 'sucessfully created account'});
            });
          }else{
            res.send({error: 'Account Not Created'});
          }
        });
    });
  });
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
  queries.getUserFromEmail(req.body.email.toLowerCase()).then((user)=>{
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

router.post('/available-email', (req,res,next)=>{
  queries.checkEmailAvailability(req.body.email).then((available)=>{
    res.send(available);
  });
});

router.delete('/logout',(req,res,next)=>{
  res.clearCookie('user');
  res.send(true);
});

router.use('*', (req,res,next)=>{
  if(req.cookies.user){
    jwt.verify(req.cookies.user, process.env.JWT_SECRET, (err, user)=>{
      if (user === undefined){
        res.clearCookie('user');
        res.redirect('/login.html');
      }else{
        req.user = user;
        next();
      }
    });
  }else{
    res.redirect('/login.html');
  }
});


function unifyNewUser(user){
  user.firstName = `${user.firstName[0].toUpperCase()}${user.firstName.substr(1)}`;
  user.lastName = `${user.lastName[0].toUpperCase()}${user.lastName.substr(1)}`;
  user.email = user.email.toLowerCase();
}



module.exports = router;
