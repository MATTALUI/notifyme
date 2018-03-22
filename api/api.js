const express = require('express');
const users = require('./users.js');
const organizations = require('./organizations.js');
const messages = require('./messages.js');
const router = express.Router();


router.use('/organizations/:orgId/messages', messages);
router.use('/organizations', organizations);


module.exports = router;
