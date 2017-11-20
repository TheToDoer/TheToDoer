var pgp = require('pg-promise')();

//db connect string
var conn = process.env.DATABASE_URL || 'postgres://postgres:root@localhost:5433/TheToDoer';
var db = pgp(conn);


//export module
module.exports = db;
