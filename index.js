var express = require('express');
var app = express();



//Routes
app.use(require('./controller/routes'));  //http://127.0.0.1:8000/    http://127.0.0.1:8000/about
app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
