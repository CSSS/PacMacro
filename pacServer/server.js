var express = require('express');
var app = express();
var http = require('http');

// TODO: Check with jace about which port to use
var port = process.env.PORT || 80;

// parsing body
app.use(express.json());
app.use(express.urlencoded( { extended:false} ));

var options = {
  dotfiles: 'ignore',
  etag: false,
  extensions: ['htm','html'],
  index: "index.html"
};

app.use('/', function(req,res,next){
  console.log(req.method, 'request:', req.url, JSON.stringify(req.body));
  next();
});

app.use('/', express.static('../', options));

app.post('/admin', (req, res)=>{
    if(req.body.pass === process.env.PASSWORD){
        res.send(true);
    }
    else{
        res.send(false);
    }
});

app.all('*', function(req, res){
  res.status(404);
  res.sendFile(__dirname + '../error.html');
});

http.createServer(app).listen(port);
console.log('running on port',port);
