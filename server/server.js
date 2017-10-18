const express = require('express')
const app = express()


//database connect------------------
const { Client } = require('pg');

let dbString = process.env.DATABASE_URL

console.log(dbString);

const client = new Client({
  connectionString:dbString,
  ssl: true,
});

client.connect().then(()=>{console.log("hmm");}).catch(e => {
    console.error('query error', e.message, e.stack)
  });

client.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
  if (err) throw err;
  for (let row of res.rows) {
    console.log(JSON.stringify(row));
  }
  client.end();
});

app.use(express.static('public'))
app.set('port', (process.env.PORT || 8080));


//brukeren får en tilbakemelding hvis noe går galt
app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Noe gikk veldig galt med serveren vår. Prøv igjenn siden. Send oss gjerne en epost.');
});


app.get("/",function(req,res){
    res.send("").end();
})
app.post("/list/:navn",function(req,res){
    res.send("navn").end();
})
app.get("/list/:id",function(req,res){
    res.send("id").end();
})
app.get("/list/:id/items/:deadline",function(req,res){
    res.send("items").end();
})
app.put("/list/:id/filter",function(req,res){
    res.send("filter").end();
})


app.listen(app.get('port'), function () {
  console.log('Example app listening on port 8080!')
})
