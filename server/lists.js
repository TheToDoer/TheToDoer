var express = require('express');
var router = express.Router();
var db = require('./dbconnect'); //database
var bodyParser = require('body-parser').text();

var jwt = require("jsonwebtoken");
var key = "bottyja235%%dasa"; //used to check the token. Burde kanskje gjemmes senere.
var logindata; //logindata from the token


//Authorize all list-endpoints --------------------
router.use(function (req, res, next) {

    //get the token from the URL-variable named 'token'
    var token = req.query['token'];

    if (!token) {
        res.status(403).json({msg: "No token received"}); //send
        return; //quit
    }
    else {
        try {
          logindata = jwt.verify(token, key); //check the token
        }
        catch(err) {
          res.status(403).json({msg: "The token is not valid!"}); //send
          return; //quit
        }
    }

    next(); //we have a valid token - go to the requested endpoint
});


//endpoint: GET list with items -----------------------------
router.get('/', function (req, res) {


  console.log("get success!");

  var sql = `PREPARE get_lists (text) AS
              SELECT * FROM taskview WHERE loginname=$1;
              EXECUTE get_lists('${logindata.loginname}')`;


    db.any(sql).then(function(data) {

        db.any("DEALLOCATE get_lists");
        res.status(200).json(data); //success – send the data as JSON!

    }).catch(function(err) {

        res.status(500).json(err);

    });
});

//endpoint: GET list -----------------------------
router.get('/yourlist', function (req, res) {


  console.log("get success!");

  var sql = `PREPARE get_list (text) AS
              SELECT * FROM listview WHERE loginname=$1;
              EXECUTE get_list ('${logindata.loginname}')`;

    db.any(sql).then(function(data) {

        db.any("DEALLOCATE get_list");
        res.status(200).json(data); //success – send the data as JSON!

    }).catch(function(err) {

        res.status(500).json(err);

    });
});

router.post('/', bodyParser, function (req, res) {

    var upload = JSON.parse(req.body);

    var sql = `PREPARE insert_list (int, text, text ,text) AS
                INSERT INTO tasklists VALUES(DEFAULT, $2, $3, $4); EXECUTE insert_list
                (0, '${upload.list_name}', '${upload.list_description}', '${logindata.loginname}')`;

    db.any(sql).then(function(data) {

	db.any("DEALLOCATE insert_list");
	res.status(200).json({msg: "insert ok"}); //success!

    }).catch(function(err) {

        	res.status(500).json(err);

    });
});

//create item-------------------------------------------
router.post('/item', bodyParser, function (req, res) {

    var upload = JSON.parse(req.body);

// insert item kode--------------------------
      var sql = `PREPARE insert_item (int, text, text, text, date, time ) AS
                  INSERT INTO list_items VALUES(DEFAULT, $2, $3, $4, $5, $6); EXECUTE insert_item
                  (0, '${upload.item_name}', '${upload.list_name}', '${logindata.loginname}', '${upload.duedate}','${upload.duetime}')`;

      console.log(sql);

    db.any(sql).then(function(data) {

	     db.any("DEALLOCATE insert_item");


	    res.status(200).json({msg: "insert ok"}); //success!

    }).catch(function(err) {

        	res.status(500).json(err);

    });
});


//delete list-----------------------------------------------
router.delete('/', function (req, res) {

    var upload = req.query.listname;

    var sql = `PREPARE delete_list (text, text) AS
             DELETE FROM tasklists WHERE list_name=$1 AND loginname=$2 RETURNING *;
             EXECUTE delete_list('${upload}', '${logindata.loginname}')`;


    db.any(sql).then(function(data) {

        db.any("DEALLOCATE delete_list");

        if (data.length > 0) {
            res.status(200).json({msg: "delete ok"}); //success!
        }
        else {
            res.status(200).json({msg: "can't delete"});
        }

    }).catch(function(err) {
        res.status(500).json(err);
    });
});

//delete item-----------------------------------------------

router.delete('/item', function (req, res) {

    var upload = req.query.ItemName;
    var upload2 = req.query.ListName;

    var sql = `PREPARE delete_item (text ,text, text) AS
                 DELETE FROM list_items WHERE item_name=$1 AND list_name=$2 AND loginname=$3 RETURNING *;
                 EXECUTE delete_item ('${upload}', '${upload2}', '${logindata.loginname}')`;

    console.log(sql);

    db.any(sql).then(function(data) {

        db.any("DEALLOCATE delete_item");

        if (data.length > 0) {
            res.status(200).json({msg: "delete ok"}); //success!
        }
        else {
            res.status(200).json({msg: "can't delete"});
        }

    }).catch(function(err) {
        res.status(500).json(err);
    });
});

//export module -------------------------------------
module.exports = router;
