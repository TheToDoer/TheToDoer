var express = require('express')
var router = express.Router();
var db = require('./dbconnect'); //database
var bodyParser = require('body-parser').text();
var jwt = require("jsonwebtoken");

//crypto-------------------------------------

var CryptoJS = require("crypto-js");
var key = "bottyja235%%dasa"; //burde puttes i en separat fil senere


//endpoint: CREATE users -----------------------------
router.post('/', bodyParser, function (req, res) {

  var upload = JSON.parse(req.body);

    var encrPassw = CryptoJS.AES.encrypt(upload.password, key);  //hash the password

    var sql = `PREPARE insert_user (int, text, text, text) AS
                INSERT INTO users VALUES(DEFAULT, $2, $3, $4); EXECUTE insert_user
                (0, '${upload.loginname}', '${encrPassw}', '${upload.fullname}')`;


    db.any(sql).then(function(data) {

        db.any("DEALLOCATE insert_user");

        //create the token
        var payload = {loginname: upload.loginname, fullname: upload.fullname};
        var tok = jwt.sign(payload, key, {expiresIn: "3h"});

        //send logininfo + token to the client
        res.status(200).json({loginname: upload.loginname, fullname: upload.fullname, token: tok});

    }).catch(function(err) {

        res.status(500).json({err});

    });
});


//endpoint for login: POST users/auth/ ----------------
router.post('/auth/', bodyParser, function (req, res) {

        var upload = JSON.parse(req.body); //should be sanitized

        var sql = `PREPARE get_user (text) AS
                        SELECT * FROM users WHERE loginname=$1;
                        EXECUTE get_user('${upload.loginname}')`;



        db.any(sql).then(function(data) {

        db.any("DEALLOCATE get_user");

        //if wrong user or password -> quit
        if (data.length <= 0) {
            res.status(403).json({msg: "Login name does not exists"}); //send
            return; //quit
        } else {

            //check if the password is correct
           var encPsw = data[0].password;
           var decrypted = CryptoJS.AES.decrypt(encPsw, key);
           decrypted = decrypted.toString(CryptoJS.enc.Utf8)


            if (!decrypted) {
                res.status(403).json({msg: "Wrong password"}); //send
                return; //quit
            }
        }

        //we have a valid user -> create the token
    var payload = {loginname: data[0].loginname, fullname: data[0].fullname};
    var tok = jwt.sign(payload, key, {expiresIn: "3h"});

    //send logininfo + token to the client
    res.status(200).json({loginname: data[0].loginname, fullname: data[0].fullname, token: tok});

    }).catch(function(err) {

    res.status(500).json({err});

    });
});


//export module -------------------------------------
module.exports = router;
