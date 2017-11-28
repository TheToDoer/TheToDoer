const express = require('express');
const app = express(); //server-app
var port = process.env.PORT || 8080;

app.use(express.static('public'))

// global for all routes -------------------------
app.use(function(req, res, next) {
    res.set('Access-Control-Allow-Origin', '*');
    res.set("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    next(); //go to the specified route
});

// -----------------------------------------------
//route handling is delegated to:
var lists = require('./lists.js');
app.use('/thetodoer/lists/', lists);

//Not yet implemented:
var users = require('./users.js');
app.use('/thetodoer/users/', users);

//------------------------------------------------
app.listen(port, function () {
});
