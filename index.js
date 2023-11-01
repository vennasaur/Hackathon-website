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

var ion_client_id = 'sj1YRPNqWdIaqctf2u0Qz2ns25Rblzr6hZFwA3zE'
var ion_client_secret = 'aWgmapKPLw7rJKFa3zaEGAk2koLeWZIkNSpY9wMASGmoNn6231BFjJLN018wYKuCxCCeOBFlDh7wjVG9IrjRRgCZZJQqQIjKvsBLCoWeRaC2bt0fZpKteC6aztDqEgmS'
var ion_redirect_uri = 'https://user.tjhsst.edu/2023mli1/oauthacc'

var client = new AuthorizationCode({
    client: {
        id: ion_client_id,
        secret: ion_client_secret
    },
    auth: {
        tokenHost: 'https://ion.tjhsst.edu/oauth/',
        authorizePath: 'https://ion.tjhsst.edu/oauth/authorize',
        tokenPath: 'https://ion.tjhsst.edu/oauth/token/'
        
    }
});

var authorizationUri = client.authorizeURL({
    scope: "read",
    redirect_uri: ion_redirect_uri
});
console.log('----------------------------------------------------------------------------------------')
console.log(authorizationUri)

// -------------- express 'get' handlers -------------- //
// These 'getters' are what fetch your pages

function checkAuthentication(req,res,next) {

    if ('authenticated' in req.session) {
        // the user has logged in
        next()
    }
    else {
        // the user has not logged in
        res.render('unverified', {'login_link' : authorizationUri})
    }
}
function getUserName(req,res,next) {
    var access_token = req.session.token.access_token;
    var profile_url = 'https://ion.tjhsst.edu/api/profile?format=json&access_token='+access_token;
    
    https.get(profile_url, function(response) {
    
      var rawData = '';
      response.on('data', function(chunk) {
          rawData += chunk;
      });
    
      response.on('end', function() {
        res.locals.profile = JSON.parse(rawData);
        next(); 
      });
    
    }).on('error', function(err) {
        next(err)
    });

}



app.get('/', [checkAuthentication, getUserName],

function(req,res,next){
    var profile = res.locals.profile;
    //console.log(profile) prints user components
    res.locals.ion_username = profile.ion_username;
    res.locals.picture = profile.picture;
    res.locals.full_name = profile.full_name;
    req.session.ion_username = res.locals.ion_username;
    next();
},
function(req,res,next){

    var sql = 'UPDATE pagevisits SET count=count+1;';
    
    pool.query(sql, function(error, results, fields){
        if (error) throw error;
        next()
    }) 

},
function(req,res,next){
    var sql = 'SELECT count FROM pagevisits;'
    
    pool.query(sql, function(error, results, fields){
        if (error) throw error;

        res.locals.pageC = results[0].count
        next()
    }) 
},
function(req,res,next){
 
var sql1 = 'INSERT IGNORE INTO accounts(id,full_name,nick,picture) VALUES(?,?,?,?);'
    pool.query(sql1,[res.locals.ion_username, res.locals.full_name, res.locals.full_name, res.locals.picture], function(error,results,fields){
        if(error)throw error
        next()
    })
},
function(req,res,next){
    if('authenticated' in req.session === false)
    {
        //res.locals.user = 'Guest'
        res.locals.log = 'Login'
    }
    else{
        //res.locals.user = req.session.profile
        res.locals.log = 'Logout'
    }
    next()
},
function(req,res){
    //var sql = 'SELECT count FROM pagevisits;'
    var sql = 'SELECT count FROM fools;'
    pool.query(sql, function(error, results, fields){
        if (error) throw error;

        var params = {
        	'data' : res.locals.pageC,
        	'fools': results[0].count,
        	'guest' : res.locals.ion_username,
        	'logs' : res.locals.log
        };
        res.render('hPage',params)
    }) 
})

// -------------- intermediary login_worker helper -------------- //
async function convertCodeToToken(req, res, next) {
    var theCode = req.query.code;

    var options = {
        'code': theCode,
        'redirect_uri': ion_redirect_uri,
        'scope': 'read'
     };
    
    // needed to be in try/catch
    try {
        var accessToken = await client.getToken(options);      // await serializes asyncronous fcn call
        res.locals.token = accessToken.token;
        next()
    } 
    catch (error) {
        console.log('Access Token Error', error.message);
         res.send(502); // error creating token
    }
}

app.get('/oauthacc', [convertCodeToToken], function(req,res){
    req.session.authenticated = true;
    req.session.token = res.locals.token;
    
    res.redirect('https://user.tjhsst.edu/2023mli1/')
})


routes = [
    './routes/weather.js',
    './routes/mlib.js',
    './routes/votes.js',
    './routes/fools.js',
    './routes/fishy.js',
    './routes/cclicker.js',
    './routes/account.js',
    './routes/profile.js',
    './routes/settings.js',
    './routes/esports.js',
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