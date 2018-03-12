const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const queries = require('./queries.js');
const api = require('./api/api.js');
const app = express();
const port = process.env.PORT || 8000;
if (process.env.NODE_ENV !== 'production') { require('dotenv').config(); }



app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());


app.use(express.static('public'));


// these endpoints are separate from the api router so
// that they're accessable and authorization is possible
app.get('/api/users/me', (req,res,next)=>{
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
app.post('/api/users/login',(req,res,next)=>{
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

app.delete('/api/users/logout',(req,res,next)=>{
  res.clearCookie('user');
  res.send(true);
});



app.use('*', (req,res,next)=>{
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

app.use('/api', api);

app.use('/static', express.static('./frontend/build/static'));
app.use('*', (req,res,next)=>{
  res.sendFile(path.join(__dirname+'/frontend/build/index.html'));
  // res.send('normal frontend; this will be handled by react router');
});

app.listen(port, ()=>{
  console.log(`listening on ${port}`);
});
