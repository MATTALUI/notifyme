const express = require('express');
const router = express.Router();
const queries = require('../queries.js');
const twilio = require('twilio');
const client = new twilio(process.env.TWILIO_ACCOUNT, process.env.TWILIO_AUTH);


router.post('/test',(req,res,next)=>{
  res.mailer.send('message',{
    to: process.env.TEST_CONTACTS,
    subject: 'Hello world',
    body: 'This is a test of the mailer services.',
    sender: 'API TEST'
  },(err)=>{
    if(err){
      console.log(err);
      res.send('failure');
    }else{
      res.send('success');
    }

  });
});


router.post('/',(req,res,next)=>{
  req.body.adminId = req.user.id;
  queries.saveMessage(req.body).then((savedMessage)=>{
    delete savedMessage.adminId;
    savedMessage.admin = {
      id: req.user.id,
      firstName: req.user.firstName,
      lastName: req.user.lastName
    };
    prepareToSendMessages(savedMessage, res.mailer);
    res.send(savedMessage);
  });
});




function prepareToSendMessages(message, mailer){
  queries.getOrganizationById(message.organizationId).then((organization)=>{
    delete message.organizationId;
    message.organization = organization;
    queries.getMembers(organization.id).then((members)=>{
      members.forEach((member)=>{
        // if(member.id!==message.admin.id){return;}
        if (member.emailPreference){
          sendEmail(member, message, mailer);
        }
        if (member.phonePreference){
          sendText(member, message);
        }
        if (member.fbPreference){
          postToFacebook(member, message);
        }

      });
    });
  });
}

function sendEmail(user, message, mailer){
  mailer.send('message',{
    to: user.email,
    subject: `${message.organization.title} message`,
    body: message.body,
    sender: (message.anonymous? `${organization.title}`:`${message.admin.firstName} ${message.admin.lastName}`)
  },(err)=>{
    if(err){
      console.error(err);
    }
  });
}

function sendText(user, message){
  let options = {
    to: `+${user.phoneNumber}`,
    from: process.env.TWILIO_NUMBER,
    body: message.body
  };
  client.messages.create(options).then((msg)=>{
  });
}

function postToFacebook(user, message){
  console.log(`posting to ${user.firstName}'s facebook from ${message.organization.title} (${message.admin.firstName})`);
}







module.exports = router;
