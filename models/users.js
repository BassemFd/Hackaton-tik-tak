var mongoose = require('mongoose')



var userSchema = mongoose.Schema({
    name: String,
    firstname: String,
    email: String,
    password: String,
    destinations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'journeys' }], //?  P1/2 using clés étrangères P2/2 in index.js  ROUTE /confirm 
})

var userModel = mongoose.model('users', userSchema)

module.exports = userModel;



