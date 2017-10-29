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

module.exports = router;
