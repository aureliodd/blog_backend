'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;



var PostSchema = new Schema({ //creo un nuovo schema nel db
  title: { //titolo del post (stringa, richiesto)
    type: String,
    required: 'per favore inserire il titolo'
  },

  creator: {
    type: String,
    default: "Anonymous"
  },

  content: {
    type: String,
    required: 'per favore inserire il corpo del post'
  },

  priority: {  //sarebbe featured
    type: Number,
    default: 1
  },

  public: {
      type: Boolean,
      required: 'per favore specificare se il post è pubblico'
  },

  tags: {
    type: [String] //array di tag
  },

  Created_date: { 
    type: Date,
    default: Date.now
  },

});

//bisogna esportare il modello. significa di metterlo a disposizione di "require" in modo da poterlo importare ad esempio nel controller:
module.exports = mongoose.model('Posts', PostSchema); //mongoose richiede di chiamare il model e passare due parametri: il nome della tabella, e il riferimento allo schema creato