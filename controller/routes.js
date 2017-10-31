var express = require('express');
var router = express.Router();
const pathView = "../views/";
//Controller for the routes
//Each new routes can be added here
router.get('/', function(req, res) {
    res.render(pathView+'home.ejs' );
});

router.get('/process/breed/:factor', function(req, res) {
    var process = require('./breed/main.js');
    process.execute(req.params.factor)
    .then((result) => {
      res.render(pathView + '/breed/render.ejs', {results: result, facteur: req.params.factor});
    })
    .catch((err) => {
      res.render(pathView + 'error.ejs', {error: err});
    })
});

module.exports = router;
