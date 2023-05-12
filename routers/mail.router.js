const express = require('express');
const router = express.Router();
const mailController = require('../controllers/mail.controller');

router.post('/sendmail', mailController.sendmail);

module.exports = router;