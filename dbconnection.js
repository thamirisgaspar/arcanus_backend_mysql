var mysql = require('mysql2');

const dbconnection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'arcanus',
    port: 3306
});

module.exports = dbconnection;