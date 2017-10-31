var express = require('express');
var router = express.Router();
const pathView = "../views/";

router.get('/', function(req, res) {
    res.render(pathView+'home.ejs' );
});

router.get('/under', function(req, res) {
      res.render(pathView+'under.ejs');
});

router.get('/count/:count', function(req, res) {
    res.render(pathView+'count.ejs', {compteur: req.params.count});
});

router.get('/process/breed/:factor', function(req, res) {
    var process = require('./breed/main.js');
    process.execute(req.params.factor)
    .then((result) => {
      console.log(result);
      res.render(pathView + '/breed/render.ejs', {results: result, facteur: req.params.factor});
    })
    .catch((err) => {
      res.render(pathView + 'error.ejs', {error: err});
    })
});

module.exports = router;
