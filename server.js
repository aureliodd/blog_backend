var express = require('express'),  //richiede il modulo express.js

  app = express(),
  
  port = process.env.PORT || 3000,

  mongoose = require('mongoose'),

  Task = require('./api/models/blogModel'), //created model loading here

  bodyParser = require('body-parser'); //normalizza i dati in un oggetto javascript
  

// mongoose instance connection url connection
// Mi connetto al database. se non esiste, mongoose lo crea
mongoose.Promise = global.Promise; //ci connettiamo all'istanza di mongodb
mongoose.connect('mongodb://localhost/Postdb'); //se ogni volta non vogliamo creare un nuovo databse dobbiamo inserire "Tododb"


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


var routes = require('./api/routes/blogRoutes'); //importing route
routes(app); //register the route


app.listen(port);


console.log('blog avviato nella porta: ' + port);


app.use(function(req, res) {
    res.status(404).send({url: req.originalUrl + ' not found'})
  });