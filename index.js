const express = require('express');
const cors = require('cors');
const bodyparser = require('body-parser');
const db = require('./dbconnection');
const app = express();
const PORT = process.env.PORT || 3000;

const mailRouter = require('./routers/mail.router');
const usersRouter = require('./routers/users.router');

//database connection
db.connect((err) => {
    err?console.log('db connection failed...'):console.log('db connection success...');
});

//use express static folder
app.use(cors());
app.use(express.static("./public"));
app.use(express.urlencoded({ extended: true }));
app.use(bodyparser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/api', mailRouter);
app.use('/api', usersRouter);

//server
app.listen(PORT, (err) => {
    if (err) throw err;
    console.log('server running....', PORT);
});