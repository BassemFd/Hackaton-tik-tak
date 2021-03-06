var express = require('express');
var router = express.Router();
var journeyModel = require('../models/journey.js');
var userModel = require('../models/users.js');


var city = ["Paris","Marseille","Nantes","Lyon","Rennes","Melun","Bordeaux","Lille"]
var date = ["2018-11-20","2018-11-21","2018-11-22","2018-11-23","2018-11-24"]



// ! fonction pour formater la date
let sens = function (d) {   
    let month = String(d.getMonth() + 1);   
    let day = String(d.getDate());   
    const year = String(d.getFullYear());    
    if (month.length < 2) month = '0' + month;   
    if (day.length < 2) day = '0' + day;    
    return `${day}/${month}/${year}`; 
  }

//! GET home page. */
router.get('/', function(req, res, next) {
  const url = require('url');

  const adress = 'http://localhost:3000/default.html?age=24&name=Yaya';
  
  const parseUrl = url.parse(adress, true);
  
  console.log(parseUrl.host);
  console.log(parseUrl.pathname);
  console.log(parseUrl.port);
  console.log(parseUrl.query);
  res.render('index', { title: 'Ticketac' });
});


//! Remplissage de la base de donnée, une fois suffit
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


//! Cette route est juste une verification du Save.
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

router.get('/oops-wrong', function(req, res, next) {
  res.render('oops-wrong', { title: 'Ticketac' });
});

//! get dispo page
router.get('/dispo', function(req, res, next) {
  res.render('dispo', { title: 'Ticketac' });
});

//! get order page
router.get('/order', function(req, res, next) {
  res.render('order', { title: 'Ticketac', destinations: req.session.cart, finalDate: req.session.finalDate, total: req.session.total });
});

//! get last trips page
router.get('/last-trips', async function(req, res, next) {
   var user = await userModel.findById({ _id: req.session.user.id}).populate('destinations').exec();
   
  res.render('last-trips', { title: 'Ticketac', user, destinations: req.session.cart});
});



//! get destination and arrival from user

router.post('/destination', async function(req, res, next){
  // * Formating the date ---
  req.session.date = req.body.datepicked.split('/').reverse().join('/')
  var finalDate = req.session.date.split('-').reverse().join('/')

  var destinationList = [];
  var journey = await journeyModel.find()

  function capitalize(word) {
    return word[0].toUpperCase() + word.slice(1).toLowerCase();
  }

  var FROMLOWER = capitalize(req.body.from);
  var TOLOWER = capitalize(req.body.to);


  for(let i = 0; i < journey.length; i++){
      if(FROMLOWER === journey[i].departure && TOLOWER === journey[i].arrival && finalDate === sens(journey[i].date)){
        destinationList.push(journey[i]);
        req.session.index = journey[i].id;
      }} 

res.render('dispo', {title: 'Ticketac', destinationList, finalDate: req.session.finalDate, index: req.session.index})
});


// ! selecting destination through get to go to user basket



router.get('/add-destination', function(req, res, next) {
  


  if(req.session.cart === undefined){
      req.session.cart = [];
      }

  req.session.cart.push({
    departure: req.query.departure,
    arrival: req.query.arrival,
    date: req.query.date,
    departureTime: req.query.departureTime,
    price: req.query.price,
    id: req.query.id
  })

  let total = 0;

  for(let i = 0; i < req.session.cart.length; i++){
      total += parseInt(req.session.cart[i].price)
      }

  req.session.total = total
  res.redirect('/add-destination2');
    });

 
  router.get('/add-destination2', function(req, res, next) {
  res.render('order', { title: 'Ticketac', destinations: req.session.cart, finalDate: req.session.finalDate, total: req.session.total });
});




  //! Delete selection

router.get('/delete', async function (req, res, next){
  req.session.cart.splice(req.query.index,  1)
  req.session.total = req.session.total - req.query.price
  res.redirect('order' )
})

//! confirm payment

router.get('/confirm', async function(req, res, next){
//? P 2/2 using clés étrangères P1/2 in Models/users.js
console.log(req.session.cart)
    for(let i = 0; i<req.session.cart.length; i++){
        var updateUser = await userModel.updateOne(
          { _id: req.session.user.id},
          { $push: { destinations: req.session.cart[i].id } }
        )
      }
      req.session.cart = [];

      //? POPULATE/EXEC, doesn't modify, just reads, attribute to a variable to use this said variable (user in this case)
    var user = await userModel.findById({ _id: req.session.user.id}).populate('destinations').exec(); 
 

res.render('last-trips', {title: 'Ticketac', user, destinations: req.session.cart})
})


//! delete all from trips history

router.get('/delete-all', async function (req, res, next){

   var user =  await userModel.updateOne({ _id: req.session.user.id},
      {destinations: []}
      )
res.redirect('last-trips')
    });

module.exports = router;