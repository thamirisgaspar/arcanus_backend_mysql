const db = require("../dbconnection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailService = require('../services/mail.service');
const crypto = require('crypto');

//signup
module.exports.signup = async (req, res) => {
    //first check email already exists
    let email = `SELECT * FROM USERS WHERE username = '${req.body.username}'`;

    db.query(email, async (err, result) => {
        if (err) {
            res.send({
                status: false,
                msg: err
            });

            return;
        }

        if (result.rows.length > 0){
            res.send({
                status: false,
                msg: 'Email já cadastrado!'
            });
        } else {
            //password decript
            let pwd = await bcrypt.hash(req.body.password, 10);

            let qry = `INSERT INTO USERS (name, username, password) VALUES ('${req.body.name}', '${req.body.username}', '${pwd}')`;
            
            db.query(qry, async (err) => {
                if (err) {
                    res.send({
                        status: false,
                        msg: err
                    });

                    return;
                }

                res.send({
                    status: true,
                    msg: 'Usuário registrado com sucesso!'
                });
            });
        }
    });
}

//login
module.exports.login = async (req, res) => {
    //check email
    let email = `SELECT * FROM USERS WHERE username = '${req.body.username}'`;

    db.query(email,async (err, result) => {
        if (err) {
            res.send({
                status: false,
                msg: err
            });

            return;
        }

        if (result.rows.length > 0) {
            let pwd = await bcrypt.compare(req.body.password, result.rows[0].password);

            if (pwd == true) {
                const token = jwt.sign({result}, 'privatekey');

                res.send({
                    status: true,
                    token: token,
                    result: result.rows[0],
                    msg: 'Logado com sucesso!'
                });
            } else {
                res.send({
                    status: false,
                    msg: 'Senha inválida!'
                });
            }
        } else {
            res.send({
                status: false,
                msg: 'Usuário inválido!'
            });
        }
    });
}

//forget password and send token
module.exports.forgetPassword = async (req, res) => {
    let email = `SELECT * FROM USERS WHERE username = '${req.body.username}'`;

    db.query(email, async (err, result) => {
        if (err) {
            res.send({
                status: false,
                msg: err
            });

            return;
        }

        if (result.rows.length > 0) {
            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0');
            var yyyy = String(today.getFullYear());
            var hour = today.getHours() + 1;
            var minute = today.getMinutes();
            today = yyyy + '-' + mm + '-' + dd + ' ' + hour + ':' + minute;

            const token = crypto.randomBytes(20).toString('hex');
            
            let qry = `UPDATE USERS SET passwordresettoken = '${token}', passwordresetexpires = '${today}' WHERE id = ${result.rows[0].id};`;

            db.query(qry, async (err) => {
                if (err) {
                    res.send({
                        status: false,
                        msg: err
                    });

                    return;
                }

                let user = {
                    name: `${result.rows[0].firstname} ${result.rows[0].lastname}`,
                    email: result.rows[0].username,
                    subject: 'Esqueceu a senha?',
                    message: `<h1>Olá ${result.rows[0].name}!<h1><br>` +
                             `<h4>Você esqueceu a sua senha? Não se preocupe! Utilize o token para resetar a senha: ${token}.<h4>`
                }

                mailService.sendMail(user, info => {
                    res.send({
                        status: true,
                        info: info,
                        token: token
                    });
                });
            });
        } else {
            res.send({
                status: false,
                msg: 'E-mail inválido!'
            });
        }
    });
}

//reset password
module.exports.resetPassword = async (req, res) => {
    let user = `SELECT * FROM USERS WHERE passwordresettoken = '${req.body.token}'`;

    db.query(user, async (err, result) => {
        if (err) {
            res.send({
                status: false,
                msg: err
            });

            return;
        }

        var data = {
            'name': result.rows[0].name,
            'username': result.rows[0].username
        }
        
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0');
        var yyyy = String(today.getFullYear());
        var hour = today.getHours();
        var minute = today.getMinutes();
        today = yyyy + '-' + mm + '-' + dd + ' ' + hour + ':' + minute;

        if (new Date(today) < new Date(result.rows[0].passwordresetexpires)) {   
            let crypt = await bcrypt.hash(req.body.password, 10); 
            let qry = `UPDATE USERS SET password = '${crypt}' WHERE passwordresettoken = '${req.body.token}'`;

            db.query(qry, async (err) => {
                if (err) {
                    res.send({
                        status: false,
                        msg: err
                    });

                    return;
                }

                let user = {
                    name: data.name,
                    email: data.username,
                    subject: 'Senha alteradda com sucesso!',
                    message: `<h1>Olá ${data.name}!<h1><br>` +
                             `<h4>Sua senha foi alterada com sucesso.<h4>`
                }

                mailService.sendMail(user, info => {
                    res.send({
                        status: true,
                        info: info
                    });
                });

                res.send({
                    status: true,
                    msg: 'Senha alterada com sucesso!'
                });
            });
        } else {
            res.send({
                status: false,
                msg: 'Token expirado!'
            });
        }
    });
}