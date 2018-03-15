const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const api = require('./api/api.js');
const jwt = require('jsonwebtoken');
const usersRoute = require('./api/users.js');
const app = express();
const port = process.env.PORT || 8000;
if (process.env.NODE_ENV !== 'production') { require('dotenv').config(); }



app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());


app.use(express.static('public'));



app.use('/api/users', usersRoute);



app.use('*', (req,res,next)=>{
  if(req.cookies.user){
    jwt.verify(req.cookies.user, process.env.JWT_SECRET, (err, user)=>{
      if (user === undefined){
        res.clearCookie('user');
        res.redirect('/login.html');
      }else{
        delete user.iat;
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
