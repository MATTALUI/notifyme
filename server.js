const express = require('express');
const app = express();
let port = 8000;

app.use('/', (req,res,next)=>{
  res.send('hello world');
});

app.listen(port, ()=>{
  console.log(`listening on ${port}`);
});
