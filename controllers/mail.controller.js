const mailService = require('../services/mail.service');

module.exports.sendmail = async (req, res) => {
    let user = req.body;

    mailService.sendMail(user, info => {
        res.send(info);
    });
}