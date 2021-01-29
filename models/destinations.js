var mongoose = require('mongoose')


var destinationsSchema = mongoose.Schema({
    departure: String,
    arrival: String,
    date: Date,
    departureTime: String,
    price: Number,
  })


const DestinationModel = mongoose.model('destinations', destinationsSchema);

module.exports =  DestinationModel;

