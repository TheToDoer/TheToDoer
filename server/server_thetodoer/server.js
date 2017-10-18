const express = require('express')
const app = express()

app.use(express.static('public'))
app.set('port', (process.env.PORT || 8080));

app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('En feil har dessverre forekommet, prøv igjen senere!');
});


app.get("/",function(req,res){
    res.send("").end();
})



app.listen(app.get('port'), function () {
  console.log('Example app listening on port 8080!')
})
