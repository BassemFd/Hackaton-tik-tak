var express = require('express');
var router = express.Router();


var journeyModel = require('../models/journey.js')

var city = ["Paris","Marseille","Nantes","Lyon","Rennes","Melun","Bordeaux","Lille"]
var date = ["2018-11-20","2018-11-21","2018-11-22","2018-11-23","2018-11-24"]



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Ticketac' });
});


// Remplissage de la base de donnée, une fois suffit
router.get('/save', async function(req, res, next) {

  // How many journeys we want
  var count = 300

  // Save  ---------------------------------------------------
    for(var i = 0; i< count; i++){

    departureCity = city[Math.floor(Math.random() * Math.floor(city.length))]
    arrivalCity = city[Math.floor(Math.random() * Math.floor(city.length))]

    if(departureCity != arrivalCity){

      var newUser = new journeyModel ({
        departure: departureCity , 
        arrival: arrivalCity, 
        date: date[Math.floor(Math.random() * Math.floor(date.length))],
        departureTime:Math.floor(Math.random() * Math.floor(23)) + ":00",
        price: Math.floor(Math.random() * Math.floor(125)) + 25,
      });
       
       await newUser.save();

    }

  }
  res.render('index', { title: 'Ticketac' });
});


// Cette route est juste une verification du Save.
// Vous pouvez choisir de la garder ou la supprimer.
router.get('/result', function(req, res, next) {

  // Permet de savoir combien de trajets il y a par ville en base
  for(i=0; i<city.length; i++){

    journeyModel.find( 
      { departure: city[i] } , //filtre
  
      function (err, journey) {

          console.log(`Nombre de trajets au départ de ${journey[0].departure} : `, journey.length);
      }
    )

  }


  res.render('index', { title: 'Ticketac' });
});



//! get homepage
router.get('/homepage', function(req, res, next) {
  res.render('homepage', { title: 'Ticketac' });
});

//! get oops page
router.get('/oops', function(req, res, next) {
  res.render('oops', { title: 'Ticketac' });
});

router.post('/destination', async function(req, res, next){
var destinationList = [];

  var journey = await journeyModel.find()
for(let i = 0; i < journey.length; i++){
// var searchJourney = await new journeyModel({
//   departure: journey[i].departure,
//   arrival: journey[i].arrival,
//   date: req.body.datepicked,
//   departureTime: journey[i].departureTime,
//   price: journey[i].price,

// })
if(req.body.from === journey[i].departure && req.body.to === journey[i].arrival ){
destinationList.push(journey[i]);

console.table("THISSSSSSSSSS", destinationList)
res.render('dispo', {title: 'Ticketac', destinationList})
} 
}
 
});


module.exports = router;
