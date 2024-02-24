#!/usr/bin/nodejs

// initialize express and app class object
var express = require('express')
var app = express();

// initialize handlebars templating engine
var hbs = require('hbs')
app.set('view engine', 'hbs')

// initialize https
var https = require('https')

// initialize cookies
var cookieParser = require('cookie-parser')
app.use(cookieParser())

// initialize encrypted cookies
var cookieSession = require('cookie-session')
app.use(cookieSession({
 name:  'ccvisits',
 keys : ['equus', 'JOEAYAYA']
}))
app.use(cookieSession({
 name:  'accountid',
 keys : ['Gamble2', 'FISHAAAAAY']
}))

// initialize oauth
const { AuthorizationCode } = require('simple-oauth2');

// initialize the built-in library 'path'
var path = require('path')
console.log(__dirname)
app.use(express.static(path.join(__dirname,'static')))

var mysql = require('mysql');


var sql_params = {
  connectionLimit : 10,
  user            : process.env.DIRECTOR_DATABASE_USERNAME,
  password        : process.env.DIRECTOR_DATABASE_PASSWORD,
  host            : process.env.DIRECTOR_DATABASE_HOST,
  port            : process.env.DIRECTOR_DATABASE_PORT,
  database        : process.env.DIRECTOR_DATABASE_NAME
}

var pool  = mysql.createPool(sql_params);

console.log('----------------------------------------------------------------------------------------')
// -------------- express 'get' handlers -------------- //
// These 'getters' are what fetch your pages



app.get('/', 
function(req,res){
    //var sql = 'SELECT count FROM pagevisits;'
        res.render('zoom_state')
});


// routes = [
//     './routes/weather.js',
//     './routes/mlib.js',
//     './routes/votes.js',
//     './routes/fools.js',
//     './routes/fishy.js',
//     './routes/cclicker.js',
//     './routes/account.js',
//     './routes/profile.js',
//     './routes/settings.js',
//     './routes/esports.js',
//     './routes/svgmap.js',
//     './routes/numFacts.js'
    
//     ]
    
routes = [

    './routes/svgmap.js',
    './routes/numFacts.js'
    
    ]
routes.forEach((route) => {app.use(require(route))});





// -------------- listener -------------- //
// // The listener is what keeps node 'alive.' 

// var listener = app.listen(process.env.PORT || 8080, process.env.HOST || "0.0.0.0", function() {
var listener = app.listen(process.env.PORT || 80, process.env.HOST || "0.0.0.0", function() {
    console.log("Express server started");
});