var express = require('express');
var router = express.Router();
var mail = require('../controllers/mailController');

/* GET home page. */
router.post('/sendcode', mail.sendCode);
router.post('/sendMail', mail.sendMail);

module.exports = router;
