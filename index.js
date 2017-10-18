var express = require('express');


var app = express();


app.get('/', function(req, res) {
    res.render('../views/home.ejs' );
});

app.get('/under', function(req, res) {
      res.render('../views/under.ejs');
});

app.get('/count/:count', function(req, res) {
    res.render('../views/count.ejs', {compteur: req.params.count});
});



app.listen(8080);
