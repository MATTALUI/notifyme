const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const api = require('./api/api.js');
const app = express();
let port = 8000;


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(express.static('public'));

app.use('*', (req,res,next)=>{
  let rand = Math.floor(Math.random()*10);
  if(rand > 5){
    res.redirect('/login.html');
  }else{
    next();
  }
});

app.use('/api', api);
app.use('*', (req,res,next)=>{
  res.send('everything else');
});

app.listen(port, ()=>{
  console.log(`listening on ${port}`);
});
