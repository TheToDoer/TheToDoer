var pgp = require('pg-promise')();

//db connect string
var conn = process.env.DATABASE_URL || 'postgres://postgres:root@localhost:5433/TheToDoer';
var db = pgp(conn);
pgp.pg.defaults.ssl = true;


//export module
module.exports = db;
