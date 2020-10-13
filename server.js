var express = require('express'),  //richiede il modulo express.js

  cors = require('cors'), //modulo npm cors

  app = express(),
  
  port = process.env.PORT || 3000,

  mongoose = require('mongoose'),

  Task = require('./api/models/blogModel'), //created model loading here

  bodyParser = require('body-parser'); //normalizza i dati in un oggetto javascript
  

// mongoose instance connection url connection
// Mi connetto al database. se non esiste, mongoose lo crea
mongoose.Promise = global.Promise; //ci connettiamo all'istanza di mongodb
mongoose.connect('mongodb://localhost/Postdb', { useNewUrlParser: true , useUnifiedTopology: true}); //useNew... useUnified... sono usati solo nelle versioni recenti. la versione senza è deprecata


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());

app.get('posts/:postId', function (req, res, next) { //ho abilitato il CORS
  res.json({msg: 'This is CORS-enabled for all origins!'})
});

/* app.use(function(req, res, next){
  res.header("Access-Control-Allow-Origin","*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
}); */


var routes = require('./api/routes/blogRoutes'); //importing route
routes(app); //register the route


app.listen(port);

console.log('blog avviato nella porta: ' + port);


app.use(function(req, res) {
    res.status(404).send({url: req.originalUrl + ' not found'})
  });