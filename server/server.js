var express = require('express');
var server = express();
var port = 8000;

server.use(express.static('public'));
    
    //server default-----------------------------------------
    server.get('/', function (req, res) {
      res.send('Hei Verden');
    });


//server listen-------------------------------------------
server.listen(port, function (err,res) {
if(err){
    console.log('ops, something went wrong');  
} else{
    
 console.log('Server running on ' + port);   
    
}   
});

